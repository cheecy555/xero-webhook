const scriptName = 'xero-get-accounts';
const authToken = $['$x-xero-webhook-config'].authToken;
const baseUrl = $['$x-xero-webhook-config'].baseUrl;
const tenantId = $['$x-xero-webhook-config'].tenantId;

let idpath = $._query.id ? `/${$._query.id}`: '';

const url = `${baseUrl}CreditNotes${idpath}`;
let errorMessage = '';

const doCreateUpdate = async () => {
try {
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
                errorMessage = "An error has occurred. Please check for possible reason: a. Invalid or expired token, b. Invalid data payload format/values. c. Network/Connecting Service provider downed. ";
                log(scriptName, `${errorMessage}`, 'info');
	            throw new Error(errorMessage);
        }else{
                data = await response.json();               
               log(scriptName, `data: ${JSON.stringify(data)}`, 'debug');
        }
} catch (e) {
        	log(scriptName, `doCreateUpdate().e: ${e}`, 'debug');
	}
}

await doCreateUpdate().then(async () => { log(scriptName, 'finished', 'debug') });
            