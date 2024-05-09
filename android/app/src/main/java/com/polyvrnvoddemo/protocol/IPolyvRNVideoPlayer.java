package com.polyvrnvoddemo.protocol;

import com.polyvrnvoddemo.view.PolyvRNVodPlayer;
import com.facebook.react.bridge.ReadableMap;

/**
 * @author df
 * @create 2019/2/20
 * @Describe
 */
public interface IPolyvRNVideoPlayer {
    void setVid(PolyvRNVodPlayer player, String vid);

    void setVid(PolyvRNVodPlayer player, ReadableMap readableMap);
}
