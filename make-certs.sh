#!/bin/bash
FQDN=$1

# make directories to work from
mkdir -p certs/

# Create your very own Root Certificate Authority
openssl genrsa \
  -out certs/my-private-root-ca.privkey.pem \
  2048

# Self-sign your Root Certificate Authority
# Since this is private, the details can be as bogus as you like
openssl req \
  -x509 \
  -new \
  -nodes \
  -key certs/my-private-root-ca.privkey.pem \
  -days 1024 \
  -out certs/my-private-root-ca.cert.pem \
  -subj "/C=US/ST=Utah/L=Provo/O=ACME Signing Authority Inc/CN=example.com"

# Create a Device Certificate for each domain,
# such as example.com, *.example.com, awesome.example.com
# NOTE: You MUST match CN to the domain name or ip address you want to use
openssl genrsa \
  -out certs/privkey.pem \
  2048

# Create a request from your Device, which your Root CA will sign
openssl req -new \
  -key certs/privkey.pem \
  -out certs/csr.pem \
  -subj "/C=US/ST=Utah/L=Provo/O=ACME Tech Inc/CN=${FQDN}"

# Sign the request from Device with your Root CA
openssl x509 \
  -req -in all/csr.pem \
  -CA certs/my-private-root-ca.cert.pem \
  -CAkey certs/my-private-root-ca.privkey.pem \
  -CAcreateserial \
  -out certs/cert.pem \
  -days 500
