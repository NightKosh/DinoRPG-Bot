


set doc_dir=doc
set temp_dir=C:\Users\User1\Desktop\jsdoc-toolkit\templates\jsdoc
set jsrun_path=C:\Users\User1\Desktop\jsdoc-toolkit\jsrun.jar
set run_path=C:\Users\User1\Desktop\jsdoc-toolkit\app\run.js
set file=js

@echo Params
@echo templates : %temp_dir%
@echo app\rub   : %run_path%
@echo jsrun     : %jsrun_path%
@echo wiki      : http://code.google.com/p/jsdoc-toolkit/w/list
@echo off

java -jar %jsrun_path% %run_path% -t=%temp_dir% -d=%doc_dir% -p -q -a=true %file% 

@echo on