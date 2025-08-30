const scriptName = 'xero-get-journals';
const authToken = $['$x-xero-webhook-config'].authToken;
const baseUrl = $['$x-xero-webhook-config'].baseUrl;
const tenantId = $['$x-xero-webhook-config'].tenantId;

/* Fetch Journal Id parameter from Query*/
let journalid = '';
const allKeys = Object.keys($._query);
for (let i = 0; i < allKeys.length; i++) {       
        ele = allKeys[i];
        if(ele.toUpperCase() == 'JOURNALID'){
                journalid = $._query[allKeys[i]];
        }
}
const id = journalid ? `/${journalid}` : '';

/* Fetch Type parameter from Query*/
let type = '';
//const allKeys = Object.keys($._query);
for (let i = 0; i < allKeys.length; i++) {       
        ele = allKeys[i];
        if(ele.toUpperCase() == 'TYPE'){
                type = $._query[allKeys[i]];
        }
}

const validTypes = ['JOURNALS','MANUALJOURNALS'];
if(!validTypes.includes(type.toUpperCase())){
    //type = 'ManualJournals';
    log(scriptName, `Invalid type. Type parameter must be either 'Journals' or 'ManualJournals'`, 'error');
	throw new Error(`Invalid type. Type parameter must be either 'Journals' or 'ManualJournals'`);
}
const url = `${baseUrl}${type}${id}`;

log(scriptName, `url: ${url}`, 'info');

const doGetJournals = async () => {
try {
        if ($._req.method !== 'GET') {
           		log(scriptName, `Invalid action`, 'error');
	            throw new Error(`Invalid action`);
	    }        
        const response = await http.get(url, {  
       		headers: {
		        'Authorization': `Bearer ${authToken}`,
                'Xero-Tenant-Id': tenantId,
           		'Content-Type': 'application/json',
                'Accept': 'application/json'
       		}
	    });
        log(scriptName, `response.ok : ${response.ok}`, 'info');
        if (!response.ok) {
                const errorBody = await response.json();
                const errorMessage = "An error has occurred. Please check for possible reason: a. Invalid or expired token, b. Invalid data payload format/values. c. Network/Connecting Service provider downed. ";
                log(scriptName, `${errorMessage}`, 'info');
	            throw new Error(errorMessage);
        }else{
                data = await response.json();
                log(scriptName, `${JSON.stringify(data)}`, 'info'); 
                /*log(scriptName, `${data.Contacts}`, 'info');*/
        }
}
	catch (e) {
        	log(scriptName, `doGetJournals().e: ${e}`, 'debug');
	}
}

await doGetJournals().then(async () => { log(scriptName, 'finished', 'debug') });
            