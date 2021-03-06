module.exports = {
    "server": {
        "port": 8080,
        "context": "/miniapp-veus-api"
    },
    "blindGuardian": {
        "url": "https://miniapps.dev.amedigital.com/blind-guardian",
        "authPath": "/v1/o/auth"
    },
    "miniAppManager": {
        "url": "https://miniapps.dev.amedigital.com/miniapp-manager-api",
        "miniAppsPath": "/o/mini-apps"
    },
    "payment": {
        "url": "https://miniapps.dev.amedigital.com/payment-api",
        "authorizePath": "/o/payments/authorize"
    },
    "state": {
        "url": "https://miniapps.dev.amedigital.com/share-api/share"
    },
    "event": {
        "url": "https://miniapps.dev.amedigital.com/sandman/v1/p/events"
    },
    "ameApi": {
        "blindGuardianUrl": "https://miniapps.hml.amedigital.com/blind-guardian-api/v1",
        "paymentApi": "https://miniapps.hml.amedigital.com/payment-api"
    }
}
