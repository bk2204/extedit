var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);

//-----------------------------------------------------------------------------
var strbundle;
function getLocaleString(aName)
{
    try
    {
        if (!strbundle) {
            var strBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
            strbundle = strBundleService.createBundle("chrome://extedit/locale/extedit.properties");
        }

        if (strbundle)
            return strbundle.GetStringFromName(aName);
    }
    catch (e) {
        alert("Cannot get the localized string bundle: " + e);
    }

    return null;
}


//-----------------------------------------------------------------------------
function onOK()
{
    var extedit = document.getElementById('extedit_leEditor').value;
    extedit = extedit.replace(/(^\s+)|(\s+$)/g,'');
    document.getElementById('extedit_leEditor').value = extedit;
    
    AFwriteObjPref('extedit_leEditor');
    AFwriteObjPref('extedit_cbEditorUnicode');
    AFwriteObjPref('extedit_cbEditor83Filename');
    AFwriteObjPref('extedit_cbEditHeaders');
    AFwriteObjPref('extedit_cbEditHeaderSubject');
    AFwriteObjPref('extedit_cbEditHeaderTo');
    AFwriteObjPref('extedit_cbEditHeaderCc');
    AFwriteObjPref('extedit_cbEditHeaderBcc');
    AFwriteObjPref('extedit_cbEditHeaderReplyTo');
    AFwriteObjPref('extedit_cbEditHeaderNewsgroup');
    
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('extedit_leEditor'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('extedit_cbEditorUnicode'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('extedit_cbEditor83Filename'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('extedit_cbEditHeaders'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('extedit_cbEditHeaderSubject'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('extedit_cbEditHeaderTo'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('extedit_cbEditHeaderCc'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('extedit_cbEditHeaderBcc'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('extedit_cbEditHeaderReplyTo'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('extedit_cbEditHeaderNewsgroup'));
}

//-----------------------------------------------------------------------------
function onLoad()
{
    AFreadObjPref('extedit_leEditor', "...");
    AFreadObjPref('extedit_cbEditorUnicode', true);
    AFreadObjPref('extedit_cbEditor83Filename', false);
    AFreadObjPref('extedit_cbEditHeaders', true);
    AFreadObjPref('extedit_cbEditHeaderSubject', true);
    AFreadObjPref('extedit_cbEditHeaderTo', true);
    AFreadObjPref('extedit_cbEditHeaderCc', true);
    AFreadObjPref('extedit_cbEditHeaderBcc', true);
    AFreadObjPref('extedit_cbEditHeaderReplyTo', false);
    AFreadObjPref('extedit_cbEditHeaderNewsgroup', false);
    activate('extedit_cbEditHeaders', 'extedit_brcstEditHeaders');
    
    // 8+3 filenames are only usefull for DOS programmes, so hide this
    // prof if OS is not Windows
    if (window.navigator.platform.toLowerCase().indexOf("win") == -1) {
        var cb83 = document.getElementById('extedit_cbEditor83Filename');
        cb83.setAttribute("hidden", "true");
    }
}

//-----------------------------------------------------------------------------
function activate(cbId, broadcasterId)
{ 
    var broadcaster = document.getElementById(broadcasterId);
    var checked = document.getElementById(cbId).checked;
    if (checked) {
        broadcaster.removeAttribute("disabled");
    } else {
        broadcaster.setAttribute("disabled", "true");
    }
}

//-----------------------------------------------------------------------------
function selectEditor()
{
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, getLocaleString("SelectYourTextEditor"), nsIFilePicker.modeOpen);
    fp.appendFilters(nsIFilePicker.filterApps);
    if (fp.show() == nsIFilePicker.returnOK) {
        var filepath = fp.file.path;
        if (/\s/.test(filepath)) {
            filepath= '"' + filepath + '"';
        }
        document.getElementById('extedit_leEditor').value = filepath;
    }
}
