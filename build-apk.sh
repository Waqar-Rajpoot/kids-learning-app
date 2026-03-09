#!/bin/bash

# Script to install JDK and build the APK

echo "Installing OpenJDK 17 (full version with jlink)..."
sudo apt-get update
sudo apt-get install -y openjdk-17-jdk

echo "Setting JAVA_HOME..."
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

echo "Verifying jlink installation..."
which jlink

echo "Building APK..."
cd /home/kyim/bright-beginnings-app/android
./gradlew assembleDebug

echo "Done! APK location:"
echo "/home/kyim/bright-beginnings-app/android/app/build/outputs/apk/debug/app-debug.apk"
