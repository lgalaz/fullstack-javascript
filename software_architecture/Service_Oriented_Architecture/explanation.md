# Service-Oriented Architecture (SOA)

## Introduction

SOA organizes functionality into reusable services with standardized interfaces, often coordinated by an enterprise service bus (ESB). It predates microservices and focuses on reuse and integration across large organizations.

Note: SOA historically used SOAP/WSDL for formal service contracts, especially in enterprise environments. WSDL (Web Services Description Language) defines strict, machine-readable contracts (XML schemas, operations, and message shapes), which made integration and tooling predictable.

SOAP vs. REST:
- SOAP (Simple Object Access Protocol) is an XML-based messaging protocol with strict contracts and built-in standards for security and transactions.
- REST (Representational State Transfer) is an architectural style that uses HTTP resources and verbs with flexible payloads (often JSON).
- SOAP benefits: strong contracts, enterprise security standards (WS-* specs like WS-Security for message-level signatures/encryption), and formal tooling; REST benefits: simplicity, flexibility, and easier browser/HTTP integration. REST is not inherently less secure—it typically relies on TLS handshakes plus app-layer auth (OAuth/JWT), while SOAP can enforce stricter, standardized message-level security. WS-Security adds message-level signatures and encryption so SOAP messages remain protected even through intermediaries.

## What It Is

- Services expose business capabilities via well-defined contracts.
- Often uses centralized governance and shared infrastructure.
- Integration may be mediated by an ESB.

## When It Is the Best Solution

- Large enterprises with many legacy systems to integrate.
- Cross-team reuse of shared business capabilities.
- Scenarios requiring strong governance and formal contracts.

## Misuse and When It Is Overkill

- Overkill for greenfield products or small teams.
- ESB can become a bottleneck or single point of failure.
- Can slow delivery if governance is heavy.

## Common Use Cases

- Large enterprises integrating legacy systems with formal contracts (SOAP/WSDL).
- Shared business capabilities (customer, billing, identity) reused across many apps.
- Hybrid architectures where SOA services coexist with newer microservices.
- SOAP is still used when strict, standardized security and auditing are required (e.g., financial transactions, healthcare systems, government integrations).

## Example (Service Contract)

```text
CustomerService
  - getCustomer(id)
  - updateCustomer(id, data)
```

```javascript
// customer-service.js (contracted API)
app.get('/customers/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Ada' });
});
```

Example: consuming a WSDL SOAP service in a Node.js backend:

```javascript
// soap-client.js
const soap = require('soap');

async function getCustomer(id) {
  const wsdlUrl = 'https://example.com/customer?wsdl';
  const client = await soap.createClientAsync(wsdlUrl);
  const [result] = await client.GetCustomerAsync({ id });

  return result;
}
```
