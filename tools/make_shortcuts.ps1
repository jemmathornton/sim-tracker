# Shortcuts that open Jemma's Sim World in its own Chrome window (no tabs or address bar).
# Run:  powershell -ExecutionPolicy Bypass -File tools\make_shortcuts.ps1              (the one in the project folder only)
#       powershell -ExecutionPolicy Bypass -File tools\make_shortcuts.ps1 -Everywhere  (also on the Desktop and in the Start menu)
# Since 22 Nov 2026 (her choice: the apps load the family's shared code from Jemma's Journals) Sim World opens through the
# family's one address: the shortcut runs Jemma's Journals' tools\open_site.pyw sim-world, which starts the family server
# (http://localhost:8050) if needed and opens http://localhost:8050/sim-world/. Delete the shortcuts any time.
param([switch]$Everywhere)

$root    = Split-Path -Parent $PSScriptRoot                  # sim-world
$parent  = Split-Path -Parent $root                          # Jemma's Journals
$opener  = Join-Path $parent 'tools\open_site.pyw'
$icon    = Join-Path $root 'site\icon.ico'
$pythonw = Join-Path $env:LOCALAPPDATA 'Programs\Python\Python313\pythonw.exe'
if (-not (Test-Path $opener))  { throw "Jemma's Journals' tools\open_site.pyw was not found (is sim-world inside JemmasJournals?)." }
if (-not (Test-Path $pythonw)) { throw 'pythonw.exe (Python 3.13) was not found.' }

# Windows knows the window by the app id Chrome gives it: "Chrome." + the page's address as Chrome shortens it (read from
# the open window, 18 Oct). The shortcuts carry the same id, so Windows uses their sharp icon on the taskbar instead of
# Chrome's stretched 32px tab icon (the same fix as Jemma's Library). Kept as it was: her Desktop and Start-menu shortcuts carry it too.
$appId = 'Chrome._/C:/Users/Jemm/site/index.html'
Add-Type -TypeDefinition @'
using System; using System.Runtime.InteropServices;
public static class ShortcutAppId {
  [StructLayout(LayoutKind.Sequential, Pack = 4)] struct PROPERTYKEY { public Guid fmtid; public uint pid; }
  [StructLayout(LayoutKind.Explicit, Size = 24)] struct PROPVARIANT { [FieldOffset(0)] public ushort vt; [FieldOffset(8)] public IntPtr p; }
  [ComImport, Guid("886D8EEB-8CF2-4446-8D02-CDBA1DBDCF99"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  interface IPropertyStore { [PreserveSig] int GetCount(out uint c); [PreserveSig] int GetAt(uint i, out PROPERTYKEY k);
    [PreserveSig] int GetValue(ref PROPERTYKEY k, out PROPVARIANT v); [PreserveSig] int SetValue(ref PROPERTYKEY k, ref PROPVARIANT v); [PreserveSig] int Commit(); }
  [ComImport, Guid("0000010b-0000-0000-C000-000000000046"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  interface IPersistFile { void GetClassID(out Guid c); [PreserveSig] int IsDirty(); void Load([MarshalAs(UnmanagedType.LPWStr)] string f, uint mode);
    void Save([MarshalAs(UnmanagedType.LPWStr)] string f, bool remember); void SaveCompleted([MarshalAs(UnmanagedType.LPWStr)] string f); void GetCurFile(out IntPtr f); }
  public static void Set(string path, string id) {
    var link = Activator.CreateInstance(Type.GetTypeFromCLSID(new Guid("00021401-0000-0000-C000-000000000046")));
    ((IPersistFile)link).Load(path, 2);
    var key = new PROPERTYKEY { fmtid = new Guid("9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3"), pid = 5 };
    var v = new PROPVARIANT { vt = 31, p = Marshal.StringToCoTaskMemUni(id) };
    var st = (IPropertyStore)link;
    Marshal.ThrowExceptionForHR(st.SetValue(ref key, ref v)); Marshal.ThrowExceptionForHR(st.Commit());
    ((IPersistFile)link).Save(path, true);
    Marshal.FreeCoTaskMem(v.p);
  }
}
'@

$shell = New-Object -ComObject WScript.Shell
$dirs = @($root)
if ($Everywhere) { $dirs += [Environment]::GetFolderPath('Desktop'), [Environment]::GetFolderPath('Programs') }
foreach ($dir in $dirs) {
    $lnk = $shell.CreateShortcut((Join-Path $dir "Jemma's Sim World.lnk"))
    $lnk.TargetPath       = $pythonw
    $lnk.Arguments        = "`"$opener`" sim-world"
    $lnk.IconLocation     = "$icon,0"
    $lnk.WorkingDirectory = $parent
    $lnk.Description      = "Jemma's Sim World"
    $lnk.Save()
    [ShortcutAppId]::Set($lnk.FullName, $appId)
    "Made $($lnk.FullName)"
}
