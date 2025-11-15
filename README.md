advlib-epc
==========

Decoding library for Electronic Product Codes of Gen 2 RFID tags based on the EPC Tag Data Standard (TDS).

__advlib-epc__ is a lightweight [Node.js package](https://www.npmjs.com/package/advlib-epc) that implements EPC URI processing based on the EPC Tag Data Standard.


Installation
------------

    npm install advlib-epc


Hello advlib-epc!
-----------------

```javascript
const advlib = require('advlib-epc');

let binaryEPC = '3074257bf7194e4000001a85';

let processedEPC = advlib.processEPC(binaryEPC);

console.log(processedEPC);
```

Which should yield the following console output:

    { uri: "urn:epc:tag:sgtin-96:3.0614141.812345.6789" }


Supported Schemes
-----------------

The following EPC schemes are supported by __advlib-epc__.

| Scheme   | Name                                |
|:---------|:------------------------------------|
| SGTIN-96 | Serialised Global Trade Item Number |


Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.


License
-------

MIT License

Copyright (c) 2022-2025 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
