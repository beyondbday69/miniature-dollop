plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
}

android {
    namespace = "com.example.voxlink_mobile"
    compileSdk = 36

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = "11"
    }

    defaultConfig {
        applicationId = "com.example.voxlink_mobile"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.debug
        }
    }

    packagingOptions {
        pickFirst 'META-INF/proguard/androidx-*.pro'
        pickFirst 'META-INF/gradle/incremental.annotation.processors'
    }

    lint {
        checkReleaseBuilds = false
        abortOnError = false
        disable 'MissingTranslation', 'ExtraTranslation'
    }
}

flutter {
    source = '../..'
}

dependencies {
}
