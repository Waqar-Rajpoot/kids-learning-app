package app.lovable.ac174a0743934dfc934888a1cef76330;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        configureWebView();
    }

    @Override
    public void onStart() {
        super.onStart();
        configureWebView();
    }

    private void configureWebView() {
        // Configure WebView for audio and speech synthesis
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            WebSettings webSettings = webView.getSettings();

            // Enable media playback without user gesture
            webSettings.setMediaPlaybackRequiresUserGesture(false);

            // Enable DOM storage for better audio handling
            webSettings.setDomStorageEnabled(true);

            // Enable JavaScript
            webSettings.setJavaScriptEnabled(true);

            // Allow file access for local audio files
            webSettings.setAllowFileAccess(true);
            webSettings.setAllowContentAccess(true);
            webSettings.setAllowFileAccessFromFileURLs(true);
            webSettings.setAllowUniversalAccessFromFileURLs(true);

            // Enable mixed content for audio
            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

            // Enable caching for better performance
            webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
            webSettings.setDatabaseEnabled(true);
        }
    }
}
