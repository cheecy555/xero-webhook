const scriptName = 'xero-create-update-journal';
const authToken = $['$x-xero-webhook-config'].authToken;
const baseUrl = $['$x-xero-webhook-config'].baseUrl;
const tenantId = $['$x-xero-webhook-config'].tenantId;

let journalId = '';
const allKeys = Object.keys($._query);
for (let i = 0; i < allKeys.length; i++) {       
        ele = allKeys[i];
        if(ele.toUpperCase() == 'JOURNALID'){
                journalId = $._query[allKeys[i]];
        }
}
const idPath = journalId ? `/${journalId}` : '';

const url = `${baseUrl}ManualJournals${idPath}`;
let errorMessage = '';

const doCreateUpdate = async () => {
try {
        if ($._req.method !== 'POST') {
            errorMessage = `Invalid action. API must be POST method`;
            log(scriptName, errorMessage, 'error');
	        throw new Error(errorMessage);
        }
        
        if(JSON.stringify(data).length<=2){
            errorMessage = `No payload data received`;
            log(scriptName, errorMessage , 'error');
	        throw new Error(errorMessage);
        }
        const response = await http.post(url, {  
       		body: JSON.stringify(data),
       		headers: {
		        'Authorization': `Bearer ${authToken}`,
                'Xero-Tenant-Id': tenantId,
           		'Content-Type': 'application/json',
                'Accept': 'application/json'
       		}
	    });
        if (!response.ok) {
                const errorBody = await response.json();
                errorMessage = "An error has occurred. Please check for possible reason: a. Invalid or expired token, b. Invalid data payload format/values. c. Network/Connecting Service provider downed. ";
                log(scriptName, `${errorMessage}`, 'info');
	            throw new Error(errorMessage);
        }else{
                data = await response.json();
                log(scriptName, `${JSON.stringify(data.ManualJournals)}`, 'info');
        }
}
	catch (e) {
        	log(scriptName, `doCreateUpdate().e: ${e}`, 'debug');
	}
}

await doCreateUpdate().then(async () => { log(scriptName, 'finished', 'debug') });
            