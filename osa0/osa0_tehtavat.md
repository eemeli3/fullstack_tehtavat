```mermaid
sequenceDiagram;
    participant Browser;
    participant Server;
    Browser->>Server: A-->B;
    activate server;
    Server->>Browser: B-->C;
    deactivate server;
```
