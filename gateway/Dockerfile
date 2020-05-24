FROM alpine
RUN apk add --no-cache ca-certificates
COPY gateway /etvgateway
EXPOSE 443
ENTRYPOINT [ "/etvgateway" ]
