const scriptName = 'xero-void-invoice';
const authToken = $['$x-xero-webhook-config'].authToken;
const baseUrl = $['$x-xero-webhook-config'].baseUrl;
const tenantId = $['$x-xero-webhook-config'].tenantId;
let errorMessage = '';

if ($._req.method !== 'POST') {
        errorMessage = `Invalid action. API must be POST method`;
        log(scriptName, errorMessage, 'error');
	    throw new Error(errorMessage);
}

if(JSON.stringify(data).length==2){
        errorMessage = `No payload data received`;
        log(scriptName, errorMessage , 'error');
	    throw new Error(errorMessage);
}

if(!data?.Invoices[0]?.InvoiceID){
        errorMessage = `payload data does not contain InvoiceID `;
        log(scriptName, errorMessage, 'error');
	    throw new Error(errorMessage);
}
const url = `${baseUrl}Invoices`;
const doVoidInvoice = async () => {
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

log(scriptName, `response.ok: ${response.ok}`, 'info');
        if (!response.ok) {
                const errorBody = await response.json();
                //const errorMessage = "An error has occurred. Please check for possible reason: a. Invalid or expired token, b. Invalid data payload format/values. c. Network/Connecting Service provider downed. ";
                //log(scriptName, `${errorMessage}`, 'info');
                const errorMessage = JSON.stringify(errorBody);
                log(scriptName, `${JSON.stringify(errorBody)}`, 'info');
	            throw new Error(errorMessage);
        }else{
                data = await response.json();
                log(scriptName, `${JSON.stringify(data)}`, 'info');
        }
}
	catch (e) {
        	log(scriptName, `doVoidInvoice().e: ${e}`, 'debug');
	}
}

await doVoidInvoice().then(async () => { log(scriptName, 'finished', 'debug') });
            