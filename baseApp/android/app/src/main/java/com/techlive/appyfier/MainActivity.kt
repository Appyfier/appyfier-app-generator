package com.techlive.appyfier

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import kotlinx.android.synthetic.main.activity_main.*
import com.treebo.internetavailabilitychecker.InternetAvailabilityChecker
import com.treebo.internetavailabilitychecker.InternetConnectivityListener
import im.delight.android.webview.AdvancedWebView
import android.graphics.Bitmap
import android.view.View
import android.content.Intent

class MainActivity : AppCompatActivity() , InternetConnectivityListener, AdvancedWebView.Listener {

    private val url: String = "https://www.google.com/"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        InternetAvailabilityChecker.init(this)
        var mInternetAvailabilityChecker = InternetAvailabilityChecker.getInstance()
        mInternetAvailabilityChecker.addInternetConnectivityListener(this)

        setContentView(R.layout.activity_main)
        errorView.visibility = View.INVISIBLE
        webView.setListener(this, this)
        webView.loadUrl(url)
    }

    override fun onPageStarted(url: String, favicon: Bitmap?) {
        loaderView.visibility = View.VISIBLE
        errorView.visibility = View.INVISIBLE
    }

    override fun onPageFinished(url: String) {
        loaderView.visibility = View.INVISIBLE
    }

    override fun onPageError(errorCode: Int, description: String, failingUrl: String) {
        loaderView.visibility = View.INVISIBLE
        errorView.visibility = View.VISIBLE
    }

    override fun onDownloadRequested(
        url: String,
        suggestedFilename: String,
        mimeType: String,
        contentLength: Long,
        contentDisposition: String,
        userAgent: String
    ) {
        if (AdvancedWebView.handleDownload(this, url, suggestedFilename)) {
            // download successfully handled
        }
    }

    override fun onExternalPageRequest(url: String) {}

    override fun onActivityResult(requestCode: Int, resultCode: Int, intent: Intent?) {
        super.onActivityResult(requestCode, resultCode, intent)
        webView.onActivityResult(requestCode, resultCode, intent)
    }

    override fun onBackPressed() {
        if(webView.canGoBack()) {
            webView.goBack()
        } else {
            moveTaskToBack(true)
        }
    }

    override fun onInternetConnectivityChanged(isConnected: Boolean) {
        if (isConnected) {
            webView.loadUrl(url)
        }
    }

    override fun onDestroy() {
        webView.onDestroy()
        super.onDestroy()
    }


}

