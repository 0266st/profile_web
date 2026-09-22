// Single source for the published GPG key: the footer and /gpg.asc both read
// from here. Paste the ASCII-armored public key and its fingerprint to go live;
// while either is null the page shows a "not published yet" note and
// /gpg.asc returns 404.
export const GPG_PUBLIC_KEY: string | null = `-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEarMLfhYJKwYBBAHaRw8BAQdAH4ZUMa+QG79ypuKcrfr30ldC8NVz4mZrdYDt
yPSQ4Vu0GDAyNjZzdCA8bWFpbkB6dHNzc3QuZGV2PoiZBBMWCgBBFiEESEjmJGA0
c01vl3rSXbvh3PZlS0oFAmqzC34CGwMFCQPCZwAFCwkIBwICIgIGFQoJCAsCBBYC
AwECHgcCF4AACgkQXbvh3PZlS0oTegEAx0a1+d/iBQE/PaUb4TXkmQ4LQxbrL6u2
dit/xmHiRmkA/2APwQzMXNd7yuYfsAyrrngBGIReQC9N1QXT81Q/tZUAuDgEarML
txIKKwYBBAGXVQEFAQEHQMD4+dy1rc4x2SR5vVr1LMWSOHiybEopw2bFWovS9PAv
AwEIB4h+BBgWCgAmFiEESEjmJGA0c01vl3rSXbvh3PZlS0oFAmqzC7cCGwwFCQPC
ZwAACgkQXbvh3PZlS0qSFgEA2YPgMw8tTempGXAl4tWPPtNPQRvNLazduM5I1/lu
iAQBAMta9sCfIFfDVQs2j/WS14e/VVtG7m1x7yaLQ/Ql6G8L
=xSda
-----END PGP PUBLIC KEY BLOCK-----`;
// ed25519 [SC] + cv25519 [E], 0266st <main@ztssst.dev>, expires 2028-09-21.
export const GPG_FINGERPRINT: string | null = "4848 E624 6034 734D 6F97  7AD2 5DBB E1DC F665 4B4A";
