using System.Data;
using System.Data.Common;
using System.Globalization;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;

namespace Msst.Backend.Database;

/// <summary>Adaptador SQL Server de Windows mediante ODBC Unicode e interoperabilidad generada.</summary>
public sealed class SqlConnection : IDisposable, IAsyncDisposable
{
    internal nint Handle;
    private nint _environment;
    private readonly string _connectionString;
    private bool _disposed;
    public SqlConnection(string connectionString) => _connectionString = connectionString;
    public Task OpenAsync(CancellationToken ct = default) => Task.Run(() =>
    {
        ct.ThrowIfCancellationRequested();
        ObjectDisposedException.ThrowIf(_disposed, this);
        if (Handle != 0) return;
        if (!OperatingSystem.IsWindows()) throw new PlatformNotSupportedException("El proveedor ODBC configurado requiere Windows.");
        Odbc.Check(Odbc.SQLAllocHandle(1, 0, out _environment), 1, _environment);
        try
        {
            Odbc.Check(Odbc.SQLSetEnvAttr(_environment, 200, 3, 0), 1, _environment);
            Odbc.Check(Odbc.SQLAllocHandle(2, _environment, out Handle), 1, _environment);
            Odbc.Check(Odbc.SQLSetConnectAttrW(Handle, 103, 15, 0), 2, Handle);
            Odbc.Check(Odbc.SQLDriverConnectW(Handle, 0, _connectionString, -3, 0, 0, out _, 0), 2, Handle);
        }
        catch { Dispose(); throw; }
    }, ct);
    public void Dispose()
    {
        if (_disposed) return;
        _disposed = true;
        if (Handle != 0) { Odbc.SQLDisconnect(Handle); Odbc.SQLFreeHandle(2, Handle); Handle = 0; }
        if (_environment != 0) { Odbc.SQLFreeHandle(1, _environment); _environment = 0; }
    }
    public ValueTask DisposeAsync() { Dispose(); return ValueTask.CompletedTask; }

    public static string FromConfiguration(IConfiguration configuration)
    {
        var configured = configuration.GetConnectionString("MsstSqlServer");
        if (string.IsNullOrWhiteSpace(configured))
            throw new InvalidOperationException("Configure ConnectionStrings:MsstSqlServer mediante un proveedor seguro.");
        var source = ParseOptions(configured);
        var driver = source.TryGetValue("Driver",out var explicitDriver)
            ? explicitDriver : configuration["Database:OdbcDriver"];
        if (string.IsNullOrWhiteSpace(driver))
            throw new InvalidOperationException("Configure Database:OdbcDriver con el controlador instalado.");
        var target = new Dictionary<string,string>(StringComparer.OrdinalIgnoreCase) { ["Driver"] = driver };
        foreach (var option in source)
        {
            var mapped = option.Key.ToLowerInvariant() switch
            {
                "driver" => "Driver", "server" or "data source" => "Server", "database" or "initial catalog" => "Database",
                "user id" or "uid" => "UID", "password" or "pwd" => "PWD",
                "integrated security" or "trusted_connection" => "Trusted_Connection",
                "multipleactiveresultsets" or "mars_connection" => "MARS_Connection",
                "trustservercertificate" => "TrustServerCertificate", "encrypt" => "Encrypt",
                "connection timeout" or "connect timeout" => "Connection Timeout", "application name" or "app" => "APP",
                _ => throw new InvalidOperationException("La cadena de conexión contiene una opción no admitida por el proveedor configurado.")
            };
            var value = option.Value;
            if(mapped=="Driver") continue;
            if(mapped=="Trusted_Connection") value=BooleanOption(value,allowSspi:true);
            else if(mapped is "MARS_Connection" or "TrustServerCertificate") value=BooleanOption(value);
            else if(mapped=="Encrypt")
            {
                value=value.Trim().ToUpperInvariant() switch {
                    "TRUE" or "YES" or "MANDATORY"=>"Yes",
                    "FALSE" or "NO" or "OPTIONAL"=>"No",
                    "STRICT" when Regex.Match(driver,@"ODBC Driver (\d+) for SQL Server",RegexOptions.IgnoreCase) is var version
                        && version.Success && int.TryParse(version.Groups[1].Value,out var major) && major>=18=>"Strict",
                    _=>throw new InvalidOperationException("Encrypt contiene un valor no admitido por el controlador configurado.")
                };
            }
            if(!target.TryAdd(mapped,value))
                throw new InvalidOperationException("La cadena de conexión repite opciones equivalentes.");
        }
        // Misma política inicial para formato ODBC y formato compatible con SqlClient.
        if (!target.ContainsKey("Encrypt")) target["Encrypt"] = "Yes";
        if (!target.ContainsKey("TrustServerCertificate")) target["TrustServerCertificate"] = "No";
        return string.Join(";",target.Select(p=>p.Key+"={"+p.Value.Replace("}","}}",StringComparison.Ordinal)+"}"))+";";
    }
    private static string BooleanOption(string value,bool allowSspi=false)=>value.Trim().ToUpperInvariant() switch {
        "TRUE" or "YES"=>"Yes", "FALSE" or "NO"=>"No", "SSPI" when allowSspi=>"Yes",
        _=>throw new InvalidOperationException("La cadena de conexión contiene un valor booleano no admitido.")
    };
    // Lee llaves ODBC y comillas del formato SqlClient sin perder punto y coma ni caracteres escapados.
    private static Dictionary<string,string> ParseOptions(string text)
    {
        var values=new Dictionary<string,string>(StringComparer.OrdinalIgnoreCase);
        var position=0;
        while(position<text.Length)
        {
            while(position<text.Length&&(char.IsWhiteSpace(text[position])||text[position]==';'))position++;
            if(position==text.Length)break;
            var begin=position;
            while(position<text.Length&&text[position]!='='&&text[position]!=';')position++;
            if(position==text.Length||text[position]!='=')throw new InvalidOperationException("La cadena de conexión no es válida.");
            var key=text[begin..position].Trim();position++;
            if(key.Length==0)throw new InvalidOperationException("La cadena de conexión no es válida.");
            while(position<text.Length&&char.IsWhiteSpace(text[position]))position++;
            var value=new StringBuilder();
            if(position<text.Length&&(text[position]=='{'||text[position]==(char)39||text[position]=='"'))
            {
                var opening=text[position++];var closing=opening=='{'?'}':opening;var ended=false;
                while(position<text.Length)
                {
                    var c=text[position++];
                    if(c!=closing){value.Append(c);continue;}
                    if(position<text.Length&&text[position]==closing){value.Append(c);position++;continue;}
                    ended=true;break;
                }
                if(!ended)throw new InvalidOperationException("La cadena de conexión contiene un valor sin cerrar.");
                while(position<text.Length&&char.IsWhiteSpace(text[position]))position++;
                if(position<text.Length&&text[position]!=';')throw new InvalidOperationException("La cadena de conexión no es válida.");
            }
            else
            {
                begin=position;while(position<text.Length&&text[position]!=';')position++;
                value.Append(text[begin..position].Trim());
            }
            if(!values.TryAdd(key,value.ToString()))throw new InvalidOperationException("La cadena de conexión repite una opción.");
        }
        return values;
    }
}

public sealed class SqlException : DbException
{
    public int Number { get; }
    public override string SqlState { get; }
    internal SqlException(int number, string state, string message) : base(message) { Number = number; SqlState = state; }
}
public sealed class SqlParameter(string name, SqlDbType type)
{
    public SqlParameter(string name, SqlDbType type, int size) : this(name, type) => Size = size;
    public string ParameterName { get; } = name;
    public SqlDbType SqlDbType { get; } = type;
    public int Size { get; set; }
    public byte Precision { get; set; }
    public byte Scale { get; set; }
    public object? Value { get; set; }
    public ParameterDirection Direction { get; set; } = ParameterDirection.Input;
}
public sealed class SqlParameterCollection : List<SqlParameter>
{
    public SqlParameter Add(string name, SqlDbType type) { var p = new SqlParameter(name, type); Add(p); return p; }
    public SqlParameter Add(string name, SqlDbType type, int size) { var p = new SqlParameter(name, type, size); Add(p); return p; }
    public SqlParameter AddWithValue(string name, object? value)
    {
        var type = value switch { int => SqlDbType.Int, long => SqlDbType.BigInt, bool => SqlDbType.Bit,
            byte[] => SqlDbType.VarBinary, Guid => SqlDbType.UniqueIdentifier, DateTime => SqlDbType.DateTime2,
            DateTimeOffset => SqlDbType.DateTimeOffset, decimal => SqlDbType.Decimal, _ => SqlDbType.NVarChar };
        var p = Add(name, type); p.Value = value; return p;
    }
}

public sealed class SqlCommand(string commandText, SqlConnection connection) : IDisposable, IAsyncDisposable
{
    public string CommandText { get; set; } = commandText;
    public CommandType CommandType { get; set; } = CommandType.Text;
    public int CommandTimeout { get; set; } = 30;
    public SqlParameterCollection Parameters { get; } = [];
    private bool _disposed;
    public Task<SqlDataReader> ExecuteReaderAsync(CancellationToken ct = default) => Task.Run(() =>
    {
        ObjectDisposedException.ThrowIf(_disposed, this);
        ct.ThrowIfCancellationRequested();
        if (connection.Handle == 0) throw new InvalidOperationException("La conexión no está abierta.");
        Odbc.Check(Odbc.SQLAllocHandle(3, connection.Handle, out var handle), 2, connection.Handle);
        var bindings = new List<ParameterBuffer>();
        try
        {
            var (sql, ordered) = Parameterize(CommandText, CommandType, Parameters);
            Odbc.Check(Odbc.SQLSetStmtAttrW(handle, 0, CommandTimeout, 0), 3, handle);
            Odbc.Check(Odbc.SQLPrepareW(handle, sql, sql.Length), 3, handle);
            for (var i = 0; i < ordered.Count; i++)
            {
                var buffer = new ParameterBuffer(ordered[i]);
                bindings.Add(buffer);
                Odbc.Check(Odbc.SQLBindParameter(handle, checked((ushort)(i + 1)), buffer.Direction,
                    buffer.CType, buffer.SqlType, buffer.ColumnSize, buffer.Scale, buffer.Data, buffer.Capacity, buffer.Indicator), 3, handle);
            }
            using (ct.Register(() => Odbc.SQLCancelHandle(3, handle)))
                Odbc.Check(Odbc.SQLExecute(handle), 3, handle);
            return new SqlDataReader(handle, bindings, ct);
        }
        catch(Exception error)
        {
            foreach (var b in bindings) b.Dispose();
            Odbc.SQLFreeHandle(3, handle);
            if(error is SqlException sql && ct.IsCancellationRequested && sql.SqlState=="HY008")
                throw new OperationCanceledException("La operación SQL fue cancelada.",error,ct);
            throw;
        }
    }, ct);
    public async Task<object?> ExecuteScalarAsync(CancellationToken ct = default)
    {
        await using var reader = await ExecuteReaderAsync(ct);
        object? result = await reader.ReadAsync(ct) && reader.FieldCount > 0 ? reader.GetValue(0) : null;
        await reader.DrainAsync(ct);
        return result;
    }
    public async Task<int> ExecuteNonQueryAsync(CancellationToken ct = default)
    {
        await using var reader = await ExecuteReaderAsync(ct);
        await reader.DrainAsync(ct);
        return checked((int)reader.RecordsAffected);
    }
    public void Dispose() => _disposed = true;
    public ValueTask DisposeAsync() { Dispose(); return ValueTask.CompletedTask; }

    internal static (string Sql, List<SqlParameter> Parameters) Parameterize(string sql, CommandType type, IReadOnlyList<SqlParameter> parameters)
    {
        if (type == CommandType.StoredProcedure)
        {
            if (!Regex.IsMatch(sql, @"\A(?:\[?[A-Za-z_][A-Za-z_0-9]*\]?\.)?\[?[A-Za-z_][A-Za-z_0-9]*\]?\z", RegexOptions.CultureInvariant))
                throw new ArgumentException("Nombre de procedimiento inválido.");
            // La secuencia explícita coincide con la firma del procedimiento. ODBC conserva direcciones de salida.
            return ("{CALL " + sql + "(" + string.Join(",", parameters.Select(_ => "?")) + ")}", parameters.ToList());
        }
        if (type != CommandType.Text) throw new NotSupportedException("Tipo de comando no admitido.");
        var result = new StringBuilder(sql.Length); var ordered = new List<SqlParameter>();
        var map = parameters.ToDictionary(p => p.ParameterName, StringComparer.OrdinalIgnoreCase);
        // Solo reemplazar tokens en código, nunca cadenas, identificadores o comentarios.
        for (int i = 0; i < sql.Length;)
        {
            char ch = sql[i];
            if (ch is '\'' or '"' or '[')
            {
                var end = ch == '[' ? ']' : ch; result.Append(ch); i++;
                while (i < sql.Length) { var c = sql[i++]; result.Append(c); if (c != end) continue;
                    if (i < sql.Length && sql[i] == end) { result.Append(sql[i++]); continue; } break; }
            }
            else if (ch == '-' && i + 1 < sql.Length && sql[i + 1] == '-')
            { while (i < sql.Length && sql[i] != '\n') result.Append(sql[i++]); }
            else if (ch == '/' && i + 1 < sql.Length && sql[i + 1] == '*')
            {
                var depth = 1; result.Append("/*"); i += 2;
                while (i < sql.Length && depth > 0)
                {
                    if (i + 1 < sql.Length && sql[i] == '/' && sql[i + 1] == '*') { depth++; result.Append("/*"); i += 2; }
                    else if (i + 1 < sql.Length && sql[i] == '*' && sql[i + 1] == '/') { depth--; result.Append("*/"); i += 2; }
                    else result.Append(sql[i++]);
                }
            }
            else if (ch == '@' && (i == 0 || sql[i - 1] != '@'))
            {
                var end = i + 1; while (end < sql.Length && (char.IsLetterOrDigit(sql[end]) || sql[end] == '_')) end++;
                var token = sql[i..end];
                if (map.TryGetValue(token, out var p)) { result.Append('?'); ordered.Add(p); } else result.Append(token);
                i = end;
            }
            else { result.Append(ch); i++; }
        }
        return (result.ToString(), ordered);
    }
}

internal sealed class ParameterBuffer : IDisposable
{
    public nint Data { get; private set; }
    public nint Indicator { get; private set; }
    public int Capacity { get; }
    public short CType { get; }
    public short SqlType { get; }
    public nuint ColumnSize { get; }
    public short Direction { get; }
    public short Scale { get; }
    private readonly SqlParameter _parameter;
    public ParameterBuffer(SqlParameter parameter)
    {
        _parameter = parameter;
        Direction = parameter.Direction switch { ParameterDirection.Input => 1, ParameterDirection.Output => 4,
            ParameterDirection.InputOutput => 2, _ => throw new NotSupportedException("Dirección no admitida.") };
        var binary = parameter.SqlDbType is SqlDbType.Binary or SqlDbType.VarBinary or SqlDbType.Image or SqlDbType.Timestamp;
        CType = binary ? (short)-2 : (short)-8;
        SqlType = parameter.SqlDbType switch
        {
            SqlDbType.Int => 4, SqlDbType.BigInt => -5, SqlDbType.SmallInt => 5, SqlDbType.TinyInt => -6,
            SqlDbType.Bit => -7, SqlDbType.Decimal or SqlDbType.Money or SqlDbType.SmallMoney => 3,
            SqlDbType.Float => 8, SqlDbType.Real => 7, SqlDbType.Date => 91,
            SqlDbType.DateTime or SqlDbType.DateTime2 or SqlDbType.SmallDateTime => 93,
            SqlDbType.DateTimeOffset => -155, SqlDbType.UniqueIdentifier => -11,
            SqlDbType.Binary or SqlDbType.VarBinary or SqlDbType.Image or SqlDbType.Timestamp => -3,
            SqlDbType.VarChar or SqlDbType.Char => 12, _ => -9
        };
        Scale = parameter.SqlDbType is SqlDbType.DateTime2 or SqlDbType.DateTimeOffset ? (short)7 :
            parameter.Value is decimal dec ? (short)((decimal.GetBits(dec)[3] >> 16) & 0xff) : parameter.Scale;
        var text = parameter.Value switch { null or DBNull => "", DateTime date => date.ToString("yyyy-MM-ddTHH:mm:ss.fffffff", CultureInfo.InvariantCulture),
            DateTimeOffset date => date.ToString("O", CultureInfo.InvariantCulture), bool b => b ? "1" : "0",
            _ => Convert.ToString(parameter.Value, CultureInfo.InvariantCulture) ?? "" };
        byte[] value = binary ? parameter.Value as byte[] ?? [] : Encoding.Unicode.GetBytes(text);
        var output = Direction != 1;
        Capacity = binary ? Math.Max(value.Length, Math.Max(parameter.Size, 1)) : checked(Math.Max(text.Length + 1, output ? Math.Max(parameter.Size + 1, 256) : 1) * 2);
        Data = Marshal.AllocHGlobal(Capacity); Indicator = Marshal.AllocHGlobal(nint.Size);
        unsafe { new Span<byte>((void*)Data, Capacity).Clear(); }
        Marshal.Copy(value, 0, Data, value.Length);
        Marshal.WriteIntPtr(Indicator, parameter.Value is null or DBNull ? -1 : value.Length);
        ColumnSize = SqlType switch
        {
            4 => 10, -5 => 19, 5 => 5, -6 => 3, -7 => 1, -11 => 36, 91 => 10, 93 => 27, -155 => 34,
            3 => parameter.Precision > 0 ? parameter.Precision : (nuint)38,
            _ => (nuint)Math.Max(binary ? Capacity : Capacity / 2 - 1, 1)
        };
        if (SqlType == -9 && ColumnSize > 4000) SqlType = -10;
        if (SqlType == 12 && ColumnSize > 8000) SqlType = -1;
    }
    public void Complete()
    {
        if (Direction == 1) return;
        var length = Marshal.ReadIntPtr(Indicator).ToInt64();
        if (length == -1) { _parameter.Value = DBNull.Value; return; }
        var maximumContentBytes=CType==-2?Capacity:Capacity-sizeof(char);
        if (length < 0 || length > maximumContentBytes || (CType!=-2 && length%2!=0))
            throw new InvalidDataException("Resultado de parámetro truncado.");
        if (CType == -2) { var bytes = new byte[(int)length]; Marshal.Copy(Data, bytes, 0, bytes.Length); _parameter.Value = bytes; return; }
        var text = Marshal.PtrToStringUni(Data, (int)length / 2) ?? "";
        _parameter.Value = _parameter.SqlDbType switch
        { SqlDbType.Int => int.Parse(text, CultureInfo.InvariantCulture), SqlDbType.BigInt => long.Parse(text, CultureInfo.InvariantCulture),
            SqlDbType.Bit => text == "1", SqlDbType.Decimal => decimal.Parse(text, CultureInfo.InvariantCulture),
            SqlDbType.UniqueIdentifier => Guid.Parse(text), _ => text };
    }
    public void Dispose()
    {
        if (Data != 0) { unsafe { new Span<byte>((void*)Data, Capacity).Clear(); } Marshal.FreeHGlobal(Data); Data = 0; }
        if (Indicator != 0) { Marshal.FreeHGlobal(Indicator); Indicator = 0; }
    }
}

public sealed class SqlDataReader : IDisposable, IAsyncDisposable
{
    private nint _handle;
    private readonly List<ParameterBuffer> _bindings;
    private readonly CancellationToken _executionToken;
    private string[] _names = [];
    private short[] _types = [];
    private object[] _values = [];
    private bool _completed;
    private bool _canceled;
    public long RecordsAffected { get; private set; }
    public int FieldCount => _names.Length;
    internal SqlDataReader(nint handle, List<ParameterBuffer> bindings, CancellationToken ct)
    {
        _handle = handle; _bindings = bindings; _executionToken = ct;
        SeekResult();
    }
    private void SeekResult()
    {
        while (true)
        {
            Odbc.Check(Odbc.SQLNumResultCols(_handle, out var count), 3, _handle);
            Odbc.Check(Odbc.SQLRowCount(_handle, out var rows), 3, _handle);
            if (rows > 0) RecordsAffected += (long)rows;
            if (count > 0)
            {
                _names = new string[count]; _types = new short[count];
                var ptr = Marshal.AllocHGlobal(2048);
                try
                {
                    for (short i = 0; i < count; i++)
                    {
                        Odbc.Check(Odbc.SQLDescribeColW(_handle, (ushort)(i + 1), ptr, 1024, out _, out var type, out _, out _, out _), 3, _handle);
                        _names[i] = Marshal.PtrToStringUni(ptr) ?? throw new InvalidDataException("Columna sin nombre.");
                        _types[i] = type;
                    }
                }
                finally { Marshal.FreeHGlobal(ptr); }
                return;
            }
            if (!MoveResult()) return;
        }
    }
    private bool MoveResult()
    {
        if (_completed) return false;
        using var cancellation=_executionToken.Register(()=>Odbc.SQLCancelHandle(3,_handle));
        _executionToken.ThrowIfCancellationRequested();
        var rc = Odbc.SQLMoreResults(_handle);
        if (rc == 100)
        {
            _completed = true; _names = []; _types = [];
            foreach (var b in _bindings) b.Complete();
            return false;
        }
        CheckIo(rc,_executionToken); return true;
    }
    public Task<bool> ReadAsync(CancellationToken ct = default) => Task.Run(() =>
    {
        ct.ThrowIfCancellationRequested(); _executionToken.ThrowIfCancellationRequested();
        if (_completed || FieldCount == 0) return false;
        using var linked=CancellationTokenSource.CreateLinkedTokenSource(ct,_executionToken);
        using var registration = linked.Token.Register(() => Odbc.SQLCancelHandle(3, _handle));
        var rc = Odbc.SQLFetch(_handle);
        if (rc == 100) return false;
        CheckIo(rc,linked.Token);
        _values = new object[FieldCount];
        for (var i = 0; i < FieldCount; i++) _values[i] = ReadValue((ushort)(i + 1), _types[i],linked.Token);
        return true;
    }, ct);
    public async Task DrainAsync(CancellationToken ct = default)
    {
        if (_completed) return;
        while (true)
        {
            while (await ReadAsync(ct)) { }
            if (!MoveResult()) break;
            SeekResult();
            if (_completed) break;
        }
    }
    private void CheckIo(short result,CancellationToken ct)
    {
        try{Odbc.Check(result,3,_handle);}
        catch(SqlException error)when(ct.IsCancellationRequested&&error.SqlState=="HY008")
        {_canceled=true;throw new OperationCanceledException("La lectura SQL fue cancelada.",error,ct);}
    }
    private object ReadValue(ushort index, short type,CancellationToken ct)
    {
        var binary = type is -2 or -3 or -4;
        const int capacity = 8192;
        var ptr = Marshal.AllocHGlobal(capacity);
        try
        {
            using var data = new MemoryStream();
            while (true)
            {
                var rc = Odbc.SQLGetData(_handle, index, binary ? (short)-2 : (short)-8, ptr, capacity, out var indicator);
                if (indicator == -1) return DBNull.Value;
                if (rc == 100) break;
                CheckIo(rc,ct);
                var available = binary ? capacity : capacity - 2;
                var length = indicator >= 0 ? (int)Math.Min(indicator, available) : available;
                if (length < 0) throw new InvalidDataException("Longitud de columna inválida.");
                var bytes = new byte[length]; Marshal.Copy(ptr, bytes, 0, length); data.Write(bytes);
                if (data.Length > 64 * 1024 * 1024) throw new InvalidDataException("Resultado SQL excede el límite de transporte.");
                if (rc == 0) break;
                // Únicamente continuar ante truncamiento de datos; otros avisos se consultan en el driver.
                if (indicator >= 0 && indicator <= available) break;
            }
            var raw = data.ToArray();
            if (binary) return raw;
            var value = Encoding.Unicode.GetString(raw);
            return type switch
            {
                -7 => value is "1" or "True" or "true",
                -6 => byte.Parse(value, CultureInfo.InvariantCulture),
                5 => short.Parse(value, CultureInfo.InvariantCulture),
                4 => int.Parse(value, CultureInfo.InvariantCulture),
                -5 => long.Parse(value, CultureInfo.InvariantCulture),
                2 or 3 => decimal.Parse(value, CultureInfo.InvariantCulture),
                6 or 7 or 8 => double.Parse(value, CultureInfo.InvariantCulture),
                91 or 93 => DateTime.Parse(value, CultureInfo.InvariantCulture, DateTimeStyles.None),
                -11 => Guid.Parse(value),
                _ => value
            };
        }
        finally { Marshal.FreeHGlobal(ptr); }
    }
    public int GetOrdinal(string name)
    {
        for (var i = 0; i < _names.Length; i++) if (string.Equals(_names[i], name, StringComparison.OrdinalIgnoreCase)) return i;
        throw new IndexOutOfRangeException("Columna solicitada no disponible.");
    }
    public string GetName(int index) => _names[index];
    public object GetValue(int index) => _values[index];
    public object this[string name] => GetValue(GetOrdinal(name));
    public object this[int index] => GetValue(index);
    public bool IsDBNull(int index) => GetValue(index) is DBNull;
    public string GetString(int index) => Convert.ToString(GetValue(index), CultureInfo.InvariantCulture) ?? "";
    public int GetInt32(int index) => Convert.ToInt32(GetValue(index), CultureInfo.InvariantCulture);
    public long GetInt64(int index) => Convert.ToInt64(GetValue(index), CultureInfo.InvariantCulture);
    public bool GetBoolean(int index) => Convert.ToBoolean(GetValue(index), CultureInfo.InvariantCulture);
    public decimal GetDecimal(int index) => Convert.ToDecimal(GetValue(index), CultureInfo.InvariantCulture);
    public DateTime GetDateTime(int index) => (DateTime)GetValue(index);
    public T GetFieldValue<T>(int index) => GetValue(index) is T value ? value : throw new InvalidCastException("Tipo SQL incompatible.");
    public void Dispose()
    {
        if (_handle == 0) return;
        try { if(!_canceled&&!_executionToken.IsCancellationRequested)DrainAsync().GetAwaiter().GetResult(); }
        finally
        {
            foreach (var b in _bindings) b.Dispose();
            Odbc.SQLFreeHandle(3, _handle); _handle = 0;
        }
    }
    public async ValueTask DisposeAsync()
    {
        if (_handle == 0) return;
        try { if(!_canceled&&!_executionToken.IsCancellationRequested)await DrainAsync(); }
        finally
        {
            foreach (var b in _bindings) b.Dispose();
            Odbc.SQLFreeHandle(3, _handle); _handle = 0;
        }
    }
}

internal static partial class Odbc
{
    private const string Library = "odbc32.dll";
    [LibraryImport(Library)] internal static partial short SQLAllocHandle(short type, nint parent, out nint handle);
    [LibraryImport(Library)] internal static partial short SQLFreeHandle(short type, nint handle);
    [LibraryImport(Library)] internal static partial short SQLSetEnvAttr(nint handle, int attr, nint value, int length);
    [LibraryImport(Library)] internal static partial short SQLSetConnectAttrW(nint handle, int attr, nint value, int length);
    [LibraryImport(Library, StringMarshalling = StringMarshalling.Utf16)] internal static partial short SQLDriverConnectW(nint handle, nint window, string value, short length, nint output, short capacity, out short outputLength, ushort completion);
    [LibraryImport(Library)] internal static partial short SQLDisconnect(nint handle);
    [LibraryImport(Library, StringMarshalling = StringMarshalling.Utf16)] internal static partial short SQLPrepareW(nint handle, string command, int length);
    [LibraryImport(Library)] internal static partial short SQLSetStmtAttrW(nint handle, int attr, nint value, int length);
    [LibraryImport(Library)] internal static partial short SQLBindParameter(nint handle, ushort ordinal, short direction, short ctype, short sqltype, nuint size, short scale, nint value, nint capacity, nint indicator);
    [LibraryImport(Library)] internal static partial short SQLExecute(nint handle);
    [LibraryImport(Library)] internal static partial short SQLFetch(nint handle);
    [LibraryImport(Library)] internal static partial short SQLNumResultCols(nint handle, out short count);
    [LibraryImport(Library)] internal static partial short SQLDescribeColW(nint handle, ushort ordinal, nint name, short capacity, out short nameLength, out short type, out nuint size, out short scale, out short nullable);
    [LibraryImport(Library)] internal static partial short SQLGetData(nint handle, ushort ordinal, short type, nint target, nint capacity, out nint indicator);
    [LibraryImport(Library)] internal static partial short SQLRowCount(nint handle, out nint count);
    [LibraryImport(Library)] internal static partial short SQLMoreResults(nint handle);
    [LibraryImport(Library)] internal static partial short SQLCancelHandle(short type, nint handle);
    [LibraryImport(Library)] internal static partial short SQLGetDiagRecW(short type, nint handle, short record, nint state, out int number, nint message, short capacity, out short length);

    internal static void Check(short result, short type, nint handle)
    {
        if (result is 0 or 1 or 100) return;
        var state = Marshal.AllocHGlobal(12); var message = Marshal.AllocHGlobal(8192);
        try
        {
            var rc = SQLGetDiagRecW(type, handle, 1, state, out var number, message, 4096, out var length);
            if (rc is not (0 or 1)) throw new SqlException(0, "HY000", "El proveedor SQL no pudo completar la operación.");
            // Conservar diagnóstico solo para clasificación interna. La API nunca expone Message.
            throw new SqlException(number, Marshal.PtrToStringUni(state, 5) ?? "HY000",
                Marshal.PtrToStringUni(message, Math.Min(length, (short)4095)) ?? "Error SQL.");
        }
        finally { Marshal.FreeHGlobal(state); Marshal.FreeHGlobal(message); }
    }
}
