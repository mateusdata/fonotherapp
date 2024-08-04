
# comandos para build
eas build -p android --profile preview  => build expo generate apk for install
eas build:run -p android --latest  => baixar utim,o build android 
eas build --local --platform android --profile preview =>  build local
time eas build --local --platform android --profile preview build local com time
time eas build --local --platform ios --profile preview build ios local

eas build -p ios --profile preview build ios no servidor expo 



# MOSTRAR LISTA DE build ios
    eas build:run -p ios     

#BAIXAR O UTIMO build ios
eas build:run -p ios --latest


#Config for build expo ios and android

* ios

{
  "build": {
    "preview": {
      "ios": {
        "simulator": true
      }
    },
    "production": {}
  }
}

* android

{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview2": {
      "android": {
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "preview3": {
      "developmentClient": true
    },
    "preview4": {
      "distribution": "internal"
    },
    "production": {}
  }
}

