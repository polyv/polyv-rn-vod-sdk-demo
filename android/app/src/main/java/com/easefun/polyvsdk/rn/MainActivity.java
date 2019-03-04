package com.easefun.polyvsdk.rn;

import android.view.KeyEvent;

import com.easefun.polyvsdk.util.PolyvScreenUtils;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "PolyvVodRnDemo";
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if(KeyEvent.KEYCODE_BACK == keyCode){
            if(PolyvScreenUtils.isLandscape(this)){
                PolyvScreenUtils.setPortrait(this);
            }else {
                finish();
            }
        }
        return false;
    }
}
