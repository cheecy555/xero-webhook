const scriptName = 'xero-create-update-contact-item';
const authToken = $['$x-xero-webhook-config'].authToken;
const baseUrl = $['$x-xero-webhook-config'].baseUrl;
const tenantId = $['$x-xero-webhook-config'].tenantId;
const urlPath = $._query.urlpath ? $._query.urlpath : '';
let errorMessage = '';

if ($._req.method !== 'POST') {
        errorMessage = `Invalid action. API must be POST method`;
        log(scriptName, errorMessage, 'error');
	    throw new Error(errorMessage);
}

let jsonObj = JSON.stringify(data);
if(JSON.stringify(data).length==2){
        errorMessage = `No payload data received`;
        log(scriptName, errorMessage , 'error');
	    throw new Error(errorMessage);
}
if(!urlPath){
    errorMessage = `Invalid parameter. Please provide the parameter 'urlPath' of either 'Contacts' or 'Items'`;
    log(scriptName, errorMessage, 'error');
	throw new Error(errorMessage);  
}else{
    const validTypes = ['CONTACTS','ITEMS'];
    if(!validTypes.includes(urlPath.toUpperCase())){
            errorMessage = `Please provide a valid 'urlPath' parameter of either 'Contacts' or 'Items'`;
            log(scriptName, errorMessage, 'error');
	        throw new Error(errorMessage);  
    }
}

const url = `${baseUrl}${urlPath}`;
const doCreateContact = async () => {
try {
      
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
                const errorMessage = "An error has occurred. Please check for possible reason: a. Invalid or expired token, b. Invalid data payload format/values. c. Network/Connecting Service provider downed. ";
                log(scriptName, `${errorMessage}`, 'info');
	            throw new Error(errorMessage);
        }else{
                data = await response.json();
                if(urlPath == 'Contacts'){
                    log(scriptName, `${JSON.stringify(data.Contacts)}`, 'info');
                }else if(urlPath == 'Items'){
                    log(scriptName, `${JSON.stringify(data.Items)}`, 'info');
                }
        }
}
	catch (e) {
        	log(scriptName, `doCreateContact().e: ${e}`, 'debug');
	}
}

await doCreateContact().then(async () => { log(scriptName, 'finished', 'debug') });
            