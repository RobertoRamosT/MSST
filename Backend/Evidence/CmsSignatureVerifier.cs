using System.Security.Cryptography;
using System.Security.Cryptography.Pkcs;
using System.Security.Cryptography.X509Certificates;
namespace Msst.Backend.Evidence;

/// <summary>Verificación criptográfica compartida por carga y decisiones: documento exacto, firmante único y cadena vigente.</summary>
public sealed class CmsSignatureVerifier(IConfiguration config)
{
 public string Verify(byte[] content,byte[] signature)
 {
            var cms=new SignedCms(new ContentInfo(content),detached:true);
            cms.Decode(signature);
            if(cms.SignerInfos.Count!=1) throw new CryptographicException("SIGNATURE_SIGNER_COUNT");
            var signer=cms.SignerInfos[0];
            if(signer.DigestAlgorithm.Value is not ("2.16.840.1.101.3.4.2.1" or "2.16.840.1.101.3.4.2.2" or "2.16.840.1.101.3.4.2.3"))
                throw new CryptographicException("SIGNATURE_DIGEST_REJECTED");
            cms.CheckSignature(verifySignatureOnly:true);
            var certificate=signer.Certificate ?? throw new CryptographicException("SIGNATURE_CERTIFICATE_MISSING");
            using var chain=new X509Chain();
            chain.ChainPolicy.RevocationMode=X509RevocationMode.Online;
            chain.ChainPolicy.RevocationFlag=X509RevocationFlag.ExcludeRoot;
            chain.ChainPolicy.VerificationFlags=X509VerificationFlags.NoFlag;
            chain.ChainPolicy.ExtraStore.AddRange(cms.Certificates);
            var trustMode=config["Evidence:CertificateTrustMode"];
            if(trustMode=="CustomRootTrust") {
                var folder=config["Evidence:TrustedRootsPath"];
                if(string.IsNullOrWhiteSpace(folder) || !Directory.Exists(folder))
                    throw new CryptographicException("SIGNATURE_TRUST_NOT_CONFIGURED");
                chain.ChainPolicy.TrustMode=X509ChainTrustMode.CustomRootTrust;
                foreach(var path in Directory.EnumerateFiles(folder,"*.cer"))
                    chain.ChainPolicy.CustomTrustStore.Add(X509CertificateLoader.LoadCertificateFromFile(path));
                if(chain.ChainPolicy.CustomTrustStore.Count==0) throw new CryptographicException("SIGNATURE_TRUST_EMPTY");
            } else if(trustMode!="System") throw new CryptographicException("SIGNATURE_TRUST_NOT_CONFIGURED");
            var usage=certificate.Extensions.OfType<X509KeyUsageExtension>().FirstOrDefault();
            if(usage is null || (usage.KeyUsages & (X509KeyUsageFlags.DigitalSignature|X509KeyUsageFlags.NonRepudiation))==0 ||
                !chain.Build(certificate)) throw new CryptographicException("SIGNATURE_CHAIN_REJECTED");
            return certificate.GetCertHashString(HashAlgorithmName.SHA256).ToLowerInvariant();
 }
}
