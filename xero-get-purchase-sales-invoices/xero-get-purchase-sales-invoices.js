const scriptName = 'xero-get-invoice';
const authToken = $['$x-xero-webhook-config'].authToken;
const baseUrl = $['$x-xero-webhook-config'].baseUrl;
const tenantId = $['$x-xero-webhook-config'].tenantId;

/* Get Parameter for type, status and Invoice Id  (Non-case sensitive) */
let invtype = '', invstatus = '', invid = '';
const allKeys = Object.keys($._query);
for (let i = 0; i < allKeys.length; i++) {       
        ele = allKeys[i];
        if(ele.toUpperCase() == 'TYPE'){
                invtype = $._query[allKeys[i]];
        }
        if(ele.toUpperCase() == 'STATUS'){
                invstatus = $._query[allKeys[i]];
        }
        if(ele.toUpperCase() == 'ID'){
                invid = $._query[allKeys[i]];
        }
}

let options = '', optionand = '', typeoption = '', statusoption = '', invoiceid = '';
if(invtype || invstatus){
                options = `?where=`;
                optionand = invtype && invstatus ? " AND " : "";
                typeoption = invtype ? `Type=="${invtype.toUpperCase()}"` : "";
                statusoption = invstatus ? `Status=="${invstatus.toUpperCase()}"` : "";
                options = `${options}${typeoption}${optionand}${statusoption}`;
}
invoiceid = invid ? `/${invid}` : "";
const url = `${baseUrl}Invoices${invoiceid}${options}`;

 log(scriptName, `..url: ${url}`, 'info');
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
                log(scriptName, `${JSON.stringify(data)}`, 'info'); 
                /*log(scriptName, `${data.Contacts}`, 'info');*/
        }
}
	catch (e) {
        	log(scriptName, `doGetItem().e: ${e}`, 'debug');
	}
}

await doGetItem().then(async () => { log(scriptName, 'finished', 'debug') });
            