; Store the installer language so the app opens in it (read by `installed_lang` in lib.rs).
; 1057 = Indonesian LCID.
!macro NSIS_HOOK_POSTINSTALL
  FileOpen $0 "$INSTDIR\lang.txt" w
  ${If} $LANGUAGE == 1057
    FileWrite $0 "id"
  ${Else}
    FileWrite $0 "en"
  ${EndIf}
  FileClose $0
!macroend

!macro NSIS_HOOK_POSTUNINSTALL
  Delete "$INSTDIR\lang.txt"
!macroend
