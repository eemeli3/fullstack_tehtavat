```mermaid
sequenceDiagram;
    participant A as Browser;
    participant B as Server;
    Note over A: Append new note to HTML BODY;
    Note over A: Redraw notes;
    A->>B: POST /exampleapp/new_note_spa, PAYLOAD note;
    B-->>-A: Send message: Note created;
```

