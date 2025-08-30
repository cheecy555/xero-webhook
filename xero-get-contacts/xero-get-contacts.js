
const scriptName = 'xero-get-contacts';
const authToken = $['$x-xero-webhook-config'].authToken;
const baseUrl = $['$x-xero-webhook-config'].baseUrl;
const tenantId = $['$x-xero-webhook-config'].tenantId;

/* Get Parameter for ContactId (Non-case sensitive) */
let contactId = '';
const allKeys = Object.keys($._query);
for (let i = 0; i < allKeys.length; i++) {       
        ele = allKeys[i];
        if(ele.toUpperCase() == 'CONTACTID'){
                contactId = $._query[allKeys[i]];
        }
}
const idPath = contactId ? `/${contactId}` : '';

/* Get Parameter for ContactType (Non-case sensitive) */
let contactType = '';
//const allKeys = Object.keys($._query);
for (let i = 0; i < allKeys.length; i++) {       
        ele = allKeys[i];
        if(ele.toUpperCase() == 'CONTACTTYPE'){
                contactType = $._query[allKeys[i]];
        }
}
const type = contactType ? `/${contactType}` : '';

const url = `${baseUrl}Contacts${idPath}`;
const doGetContact = async () => {
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
                let respData = data?.Contacts;
                if(type.toUpperCase() === '/SUPPLIER'){
                           respData = respData.filter(contact => contact.IsSupplier === true);
                }else if(type.toUpperCase() === '/CUSTOMER'){
                           respData = respData.filter(contact => contact.IsCustomer === true);
                }
                data = respData;

                log(scriptName, `${JSON.stringify(data)}`, 'info'); 
                /*log(scriptName, `${data.Contacts}`, 'info');*/
        }
}
	catch (e) {
        	log(scriptName, `doGetContact().e: ${e}`, 'debug');
	}
}

await doGetContact().then(async () => { log(scriptName, 'finished', 'debug') });
            