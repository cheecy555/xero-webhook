

const scriptName = 'xero-allocate-credit-note-to-invoice';
const authToken = $['$x-xero-webhook-config'].authToken;
const baseUrl = $['$x-xero-webhook-config'].baseUrl;
const tenantId = $['$x-xero-webhook-config'].tenantId;
let errorMessage = '';

/* Get Parameter for Credit Note Id, Invoice Id and amount (Non-case sensitive) */
let creditnoteid = '', invoiceid = '', amount = 0;
const allKeys = Object.keys($._query);
for (let i = 0; i < allKeys.length; i++) {       
        ele = allKeys[i];
        if(ele.toUpperCase() == 'CNID'){
                creditnoteid = $._query[allKeys[i]];
        }
        if(ele.toUpperCase() == 'INVID'){
                invoiceid = $._query[allKeys[i]];
        }
        if(ele.toUpperCase() == 'AMOUNT'){
                amount = Number($._query[allKeys[i]]);
        }
}

if(!creditnoteid || !invoiceid || !amount || !amount){
    if(!creditnoteid) errorMessage = `No credit note Id received. Please provide credit note Id as parameter (cnid=xxxxxxxx).`;
    if(!invoiceid) errorMessage = `No invoice Id received. Please provide invoice Id as parameter (invid=xxxxxxxx).`;
    if(!amount) errorMessage = `Allocation amount is either not provided or not in numeric format (format: amount=99999).`;
    log(scriptName, errorMessage, 'error');
    throw new Error(errorMessage); 
}

const jsondata = `{"Amount": ${amount},"Invoice": {"InvoiceID": "${invoiceid}"}}`;
const idPath =  creditnoteid ? `/${creditnoteid}` : '';
const url = `${baseUrl}CreditNotes${idPath}/Allocations `;

const doCreditNoteAllocate = async () => {
try {
        const response = await http.put(url, {  
       		/*body: JSON.stringify(data),*/
            body: jsondata,
       		headers: {
		        'Authorization': `Bearer ${authToken}`,
                'Xero-Tenant-Id': tenantId,
           		'Content-Type': 'application/json',
                'Accept': 'application/json'
       		}
	});
        if (!response.ok) {
                const errorBody = await response.json();
              //  errorMessage = "An error has occurred. Please check for possible reason: a. Invalid or expired token, b. Invalid data payload format/values. c. Network/Connecting Service provider downed. ";
                log(scriptName, `${JSON.stringify(errorBody)}`, 'info');
	            throw new Error(JSON.stringify(errorBody));
        }else{
                data = await response.json();
                log(scriptName, `${JSON.stringify(data)}`, 'debug');
        }
} catch (e) {
        	log(scriptName, `doCreditNoteAllocate().e: ${e}`, 'debug');
	}
}

await doCreditNoteAllocate().then(async () => { log(scriptName, 'finished', 'debug') });
            