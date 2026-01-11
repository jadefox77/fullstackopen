# Part 0 Exercises

## 0.4: New note diagram
    (sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server  
    server-->>browser: 302 Found
    Note left of server: Do URL redirect to https://studies.cs.helsinki.fi/exampleapp/notes
    deactivate server
    
    Note right of browser: Page reloads

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: style sheet (main.css)
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: JavaScript code (main.js)
    deactivate server

    Note right of browser: Javascript code executes and fetches JSON data

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{content: "ping", date: "2026-01-09T04:23:41.040Z"},…]
    deactivate server

    Note left of server: The server creates a new note object, and adds it to an array called notes)
    
## 0.5: Single page app diagriam
    (sequenceDiagram
        participant browser
        participant server

        browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
        activate server
        server-->>browser: HTML code
        deactivate server

        browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
        activate server
        server-->>browser: main.css
        deactivate server

        browser->>server: https://studies.cs.helsinki.fi/exampleapp/spa.js
        activate server
        server-->>browser: spa.js
        deactivate server

        Note right of browser: broswers executes Javascript code that fecthes JSON from server

        browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
        activate server
        server-->>browser: [{content: "kokokoklllllllLLLLLLLLLLLLLLL", date: "2026-01-10T16:13:44.733Z"},…]
        deactivate server)
        
## 0.6: New note spa
    (sequenceDiagram
        participant browser
        participant server

        browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
        activate server
        server-->>browser: Status code 201 created
        deactivate server)
Add Part 0 exercises
    
