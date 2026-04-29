!macro customInstall
  Exec 'cmd.exe /C "timeout /t 5 > NUL && del /f /q \"$EXEPATH\""'
!macroend
