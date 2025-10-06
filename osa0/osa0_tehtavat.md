```mermaid
sequenceDiagram;
    participant A as Browser;
    participant B as Server;
    A->>+B: send new note as HTML Body with POST method. Tell server to use action: /new_note;
    Note over B: Append note to 
    B-->>-A: B-->C;
```
