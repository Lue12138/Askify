Workflow:
1. the backend read the url provided by the user, extract the web's content and store it into conversation.txt for future conversation's reference
2. based on the web's content, generate multiple choice problem for user, meanwhile append the question into conversation.txt for future conversation's reference
3. user click one of the choices, and send it to backend, backend store the response into conversation.txt
4. repeat 2-4 two times, i.e there is 3 questions and answers in total stored in conversation.txt 
5. based on the content of conversation.txt, backend generate what is user's purpose visiting the website and display the result into frontend

Issue:
1. Need a better way for credentials needed for s3_client
2. Need a better way for the formatting of the generated questions, can lead to crash
3. UI is too bold?