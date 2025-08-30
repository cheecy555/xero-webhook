const scriptName = 'xero-get-items';
const authToken = $['$x-xero-webhook-config'].authToken;
const baseUrl = $['$x-xero-webhook-config'].baseUrl;
const tenantId = $['$x-xero-webhook-config'].tenantId;

/* Get Parameter for ItemId (Non-case sensitive) */
let itemId = '';
const allKeys = Object.keys($._query);
for (let i = 0; i < allKeys.length; i++) {       
        ele = allKeys[i];
        if(ele.toUpperCase() == 'ITEMID'){
                itemId = $._query[allKeys[i]];
        }
}

const id = itemId ? `/${itemId}` : '';

const url = `${baseUrl}Items${id}`;
const doGetItem = async () => {
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
        if (!response.ok) {
                const errorBody = await response.json();
                const errorMessage = "An error has occurred. Please check for possible reason: a. Invalid or expired token, b. Invalid data payload format/values. c. Network/Connecting Service provider downed. ";
                log(scriptName, `${errorMessage}`, 'info');
	            throw new Error(errorMessage);
        }else{
                data = await response.json();
                log(scriptName, `${JSON.stringify(data.Items)}`, 'info'); 
                /*log(scriptName, `${data.Contacts}`, 'info');*/
        }
}
	catch (e) {
        	log(scriptName, `doGetItem().e: ${e}`, 'debug');
	}
}

await doGetItem().then(async () => { log(scriptName, 'finished', 'debug') });
            