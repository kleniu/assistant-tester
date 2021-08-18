/**
 *
 * Copyright 2021 Robert Kleniewski. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

let curIAMapiKey   = process.env.SERVICE_CRED_APIKEY; // Service IAM API Key
let curIAMurlAdr   = process.env.SERVICE_CRED_URL;    // Service IAM URL 
let curAssistantId = process.env.ASSISTANT_ID;        // Watson Assistant URL

var retVal = true;
var curSessionId;

const assistant = new AssistantV2({
  version: '2021-06-14',
  authenticator: new IamAuthenticator({
    apikey: curIAMapiKey,
  }),
  serviceUrl: curIAMurlAdr,
});


async function asyncSendText( curMsg ) {
    console.log('>>>>>>>>>>>> sending text >>>>>>>>>>> : ', curMsg );
    var curInput = { message_type: 'text', text: curMsg };
    retVal = (await assistant.message( { assistantId: curAssistantId, sessionId: curSessionId, input: curInput } ));
    console.log(JSON.stringify(retVal, null, 3));
} 


async function asyncRun() {
    console.log("Starting new Session to Assistant ID = ", curAssistantId);
    retVal = (await assistant.createSession( { assistantId: curAssistantId } ));
    curSessionId = retVal.result.session_id;
    console.log("Session ID                           = ", curSessionId);

    await asyncSendText('');
    await asyncSendText('What do you know?');

    console.log("Closeing Session ID                  = ", curSessionId);
    retVal = (await assistant.deleteSession( { assistantId: curAssistantId, sessionId: curSessionId } ));
    console.log("Session closed. Exiting.");

}

asyncRun();
