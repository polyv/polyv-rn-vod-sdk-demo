package com.polyv;

import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;
import android.widget.Toast;

import com.easefun.polyvsdk.PolyvBitRate;
import com.easefun.polyvsdk.PolyvDownloader;
import com.easefun.polyvsdk.PolyvDownloaderErrorReason;
import com.easefun.polyvsdk.PolyvDownloaderManager;
import com.easefun.polyvsdk.Video;
import com.easefun.polyvsdk.bean.PolyvDownloadInfo;
import com.easefun.polyvsdk.database.PolyvDownloadSQLiteHelper;
import com.easefun.polyvsdk.download.listener.IPolyvDownloaderProgressListener;
import com.easefun.polyvsdk.download.listener.IPolyvDownloaderProgressListener2;
import com.easefun.polyvsdk.download.listener.IPolyvDownloaderSpeedListener;
import com.easefun.polyvsdk.download.listener.IPolyvDownloaderStartListener;
import com.easefun.polyvsdk.download.listener.IPolyvDownloaderStartListener2;
import com.easefun.polyvsdk.log.PolyvCommonLog;
import com.easefun.polyvsdk.util.PolyvErrorMessageUtils;
import com.easefun.polyvsdk.vo.PolyvVideoVO;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.hpplay.common.utils.GsonUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * @author df
 * @create 2019/3/11
 * @Describe
 */
public class PolyvRNVodDownloadModule extends ReactContextBaseJavaModule {

    // <editor-fold defaultstate="collapsed" desc="属性">
    private static final String TAG = "PolyvRNVodDownloadModule";
    private PolyvDownloadSQLiteHelper downloadSQLiteHelper;
    private LinkedList<PolyvDownloadInfo> lists;
    private Map<String ,PolyvVideoVO> videoMaps = new HashMap<>();
    private PolyvVideoVO video;
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="RN方法">
    public PolyvRNVodDownloadModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.downloadSQLiteHelper = PolyvDownloadSQLiteHelper.getInstance(reactContext);
    }

    @Override
    public String getName() {
        return "PolyvRNVodDownloadModule";
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="react native 通信方法">
    @ReactMethod
    public void getBitrateNumbers(final String vid, final Promise promise) {
        Video.loadVideo(vid, new Video.OnVideoLoaded() {
            public void onloaded(final Video v) {
                if (v == null) {
                    Toast.makeText(getCurrentActivity(), "获取下载信息失败，请重试", Toast.LENGTH_SHORT).show();
                    promise.reject(PolyvRNVodCode.PolyvVodDownloadResultCode.DOWNLOAD_INFO_ERROR+"");
                    return;
                }

                videoMaps.put(vid,v);

                // 码率数
                List<PolyvBitRate> items = PolyvBitRate.getBitRateList(v.getDfNum());
                WritableMap map = Arguments.createMap();
                for (PolyvBitRate bitRate:items) {
                    map.putInt(bitRate.getName(),bitRate.getNum());
                }
                promise.resolve(map);
            }
        });
    }

//    //是否已经在下载队列
//    @ReactMethod
//    public void isAddDownload(String vid, Promise promise) {
//        WritableMap map = Arguments.createMap();
//        boolean isAdded = downloadSQLiteHelper.isAdd(vid);
//        map.putBoolean("videoHasAdded", isAdded);
//        promise.resolve(map);
//    }

    @ReactMethod
    public void startDownload(final String vid, final int pos, final String title, final Promise promise) {
        PolyvCommonLog.d(TAG, "id:" + vid + " pos :" + pos + "title :" + title + "  js :");
        PolyvVideoVO videoJSONVO = videoMaps.remove(vid);

        if (videoJSONVO == null) {
            PolyvCommonLog.d(TAG,"get video cache error !!");
            Video.loadVideo(vid, new Video.OnVideoLoaded() {
                public void onloaded(final Video v) {
                    if (v == null) {
                        (getCurrentActivity()).runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(getCurrentActivity(), "获取下载信息失败，请重试", Toast.LENGTH_SHORT).show();
                                promise.reject(PolyvRNVodCode.PolyvVodDownloadResultCode.DOWNLOAD_INFO_ERROR+"");
                            }
                        });
                        return;
                    }

                    videoMaps.put(vid,v);
                    startDownloadTask(vid, pos, title, promise, v);
                }
            });
            return;
        }

        startDownloadTask(vid, pos, title, promise, videoJSONVO);
    }

    private void startDownloadTask(String vid, int pos, String title, final Promise promise, PolyvVideoVO videoJSONVO) {
        int bitrate = pos;

        final PolyvDownloadInfo downloadInfo = new PolyvDownloadInfo(vid, videoJSONVO.getDuration(),
                videoJSONVO.getFileSizeMatchVideoType(bitrate), bitrate, title);
        Log.i("videoAdapter", downloadInfo.toString());
        if (downloadSQLiteHelper != null && !downloadSQLiteHelper.isAdd(downloadInfo)
                                            && !downloadSQLiteHelper.isInDatabase(vid)) {
            downloadSQLiteHelper.insert(downloadInfo);
            PolyvDownloader polyvDownloader = addDownloadListener(vid, bitrate, downloadInfo, null);
            polyvDownloader.start(getCurrentActivity());
        } else {
            (getCurrentActivity()).runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(getCurrentActivity(), "下载任务已经增加到队列", Toast.LENGTH_SHORT).show();
                    promise.reject(PolyvRNVodCode.PolyvVodDownloadResultCode.DOWNLOAD_EXIST+"");
                }
            });
        }
    }

    //获取下载列表
    @ReactMethod
    public void getDownloadVideoList(boolean hasDownloaded, Promise promise) {
        List<PolyvDownloadInfo> downloadInfos = new ArrayList<>();
        lists = downloadSQLiteHelper.getAll();
        downloadInfos.addAll(getTask(lists, hasDownloaded, null));
        WritableMap map = Arguments.createMap();
        map.putString("downloadList", GsonUtil.toJson(downloadInfos));

        promise.resolve(map);
    }



    @ReactMethod
    public void pauseDownload(String vid, int bitrate) {
        PolyvDownloader polyvDownloader = PolyvDownloaderManager.getPolyvDownloader(vid, bitrate);
        polyvDownloader.stop();
    }

    @ReactMethod
    public void resumeDownload(String vid, int bitrate) {
        PolyvDownloader polyvDownloader = PolyvDownloaderManager.getPolyvDownloader(vid, bitrate);
        polyvDownloader.start(getCurrentActivity());
    }

    @ReactMethod
    public void pauseAllDownload() {
        PolyvDownloaderManager.stopAll();
    }

    @ReactMethod
    public void startAllDownload() {
        // 已完成的任务key集合
        List<String> finishKey = new ArrayList<>();
        List<PolyvDownloadInfo> downloadInfos = downloadSQLiteHelper.getAll();
        for (int i = 0; i < downloadInfos.size(); i++) {
            PolyvDownloadInfo downloadInfo = downloadInfos.get(i);
            long percent = downloadInfo.getPercent();
            long total = downloadInfo.getTotal();
            int progress = 0;
            if (total != 0)
                progress = (int) (percent * 100 / total);
            if (progress == 100)
                finishKey.add(PolyvDownloaderManager.getKey(downloadInfo.getVid(), downloadInfo.getBitrate()));
        }
        PolyvDownloaderManager.startUnfinished(finishKey, getCurrentActivity());
    }

    @ReactMethod
    public void deleteDownload(String vid, int bitrate) {
        //移除任务
        PolyvDownloader downloader = PolyvDownloaderManager.clearPolyvDownload(vid, bitrate);
        //删除文件
        downloader.delete();
        //移除数据库的下载信息
        PolyvDownloadInfo polyvDownloadInfo = new PolyvDownloadInfo(vid, "", 0, bitrate, "");
        downloadSQLiteHelper.delete(polyvDownloadInfo);
    }

    @ReactMethod
    public void deleteAllDownload() {
        for (int i = 0; i < lists.size(); i++) {
            PolyvDownloadInfo downloadInfo = lists.get(i);
            long percent = downloadInfo.getPercent();
            long total = downloadInfo.getTotal();
            downloadInfo.setProgress(total == 0 ? 0 : (float) percent / total);
            // 已下载的百分比
            int progress = 0;
            if (total != 0) {
                progress = (int) (percent * 100 / total);
            }
            if (progress == 100) {//如果下载完成返回
                continue;
            }
            //移除任务
            PolyvDownloader downloader = PolyvDownloaderManager.clearPolyvDownload(downloadInfo.getVid(), downloadInfo.getBitrate());
            //删除文件
            downloader.delete();
            //移除数据库的下载信息
            downloadSQLiteHelper.delete(downloadInfo);
        }
    }

    /**
     * @param vid
     * @param bitrate
     * @param promise return 下载状态 0：下载中 1：暂停 2：等待下载 3：下载完成
     *                rn 保留了download info 的下载进度  是否完成  由js 判断
     */
    @ReactMethod
    public void getDownloadStatus(String vid, int bitrate, Promise promise) {
        WritableMap map = Arguments.createMap();
        int status = -1;

        PolyvDownloader downloader = PolyvDownloaderManager.getPolyvDownloader(vid, bitrate);
        if (downloader.isDownloading()) {
            status = 0;
        } else if (PolyvDownloaderManager.isWaitingDownload(vid, bitrate)) {
            status = 2;
        } else {
            status = 1;
        }

        map.putInt("downloadStatus", status);
        promise.resolve(map);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="原生监听器 和 JS事件发送">
    private PolyvDownloader addDownloadListener(String vid, int bitrate, final PolyvDownloadInfo downloadInfo, final Callback callback) {
        PolyvDownloader polyvDownloader = PolyvDownloaderManager.getPolyvDownloader(vid, bitrate);
        polyvDownloader.setPolyvDownloadProressListener2(new IPolyvDownloaderProgressListener2() {

            private long total;
            String data = GsonUtil.toJson(downloadInfo);

            @Override
            public void onDownload(long current, long total) {
                this.total = total;
                float progress = total == 0 ? 0 : (float) current / total;
                WritableMap map = Arguments.createMap();
                map.putDouble("current", current);
                map.putDouble("total", total);
                map.putDouble("progress", progress);
                map.putString("downloadInfo", data);
                sendEvent(getReactApplicationContext(), "updateProgressEvent", map);
                downloadSQLiteHelper.update(downloadInfo, current, total);
            }

            @Override
            public void onDownloadSuccess(int bitrate) {
                String vid = downloadInfo.getVid();
                int downloadBitrate = downloadInfo.getBitrate();
                WritableMap map = Arguments.createMap();
                map.putDouble("total", total);
                map.putString("vid", vid);
                map.putDouble("bitrate", downloadBitrate);
                downloadSQLiteHelper.update(downloadInfo, total, total);
                sendEvent(getReactApplicationContext(), "downloadSuccessEvent", map);
            }

            @Override
            public void onDownloadFail(@NonNull PolyvDownloaderErrorReason errorReason) {
                String errorMsg = PolyvErrorMessageUtils.getDownloaderErrorMessage(errorReason.getType());
                Toast.makeText(getCurrentActivity(), errorMsg, Toast.LENGTH_LONG).show();

                String vid = downloadInfo.getVid();
                int bitrate = downloadInfo.getBitrate();
                WritableMap map = Arguments.createMap();
                map.putString("vid", vid);
                map.putDouble("bitrate", bitrate);
                sendEvent(getReactApplicationContext(), "downloadFailedEvent", map);
            }


        });
        polyvDownloader.setPolyvDownloadStartListener2(new IPolyvDownloaderStartListener2() {
            @Override
            public void onStart() {
                String data = GsonUtil.toJson(downloadInfo);
                WritableMap map = Arguments.createMap();
                map.putString("downloadInfo", data);
                sendEvent(getReactApplicationContext(), "startDownloadEvent", map);
            }
        });

        polyvDownloader.setPolyvDownloadSpeedListener(new IPolyvDownloaderSpeedListener() {
            @Override
            public void onSpeed(int speed) {
                String vid = downloadInfo.getVid();
                int bitrate = downloadInfo.getBitrate();
                WritableMap map = Arguments.createMap();
                map.putString("vid", vid);
                map.putDouble("bitrate", bitrate);
                map.putInt("downloadSpeed", speed);
                sendEvent(getReactApplicationContext(), "downloadSpeedEvent", map);
            }
        });
        return polyvDownloader;
    }

    public static void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    // </editor-fold>
// <editor-fold defaultstate="collapsed" desc="私有方法">
    private List<PolyvDownloadInfo> getTask(List<PolyvDownloadInfo> downloadInfos, boolean isFinished, Callback callback) {
        if (downloadInfos == null) {
            return null;
        }
        List<PolyvDownloadInfo> infos = new ArrayList<>();
        for (PolyvDownloadInfo downloadInfo : downloadInfos) {
            long percent = downloadInfo.getPercent();
            long total = downloadInfo.getTotal();
            downloadInfo.setProgress(total == 0 ? 0 : (float) percent / total);
            // 已下载的百分比
            int progress = 0;
            if (total != 0) {
                progress = (int) (percent * 100 / total);
            }
            if (progress == 100) {
                if (isFinished) {
                    infos.add(downloadInfo);
                }
            } else if (!isFinished) {
                infos.add(downloadInfo);
                addDownloadListener(downloadInfo.getVid(), downloadInfo.getBitrate(), downloadInfo, callback);
            }

        }
        return infos;
    }
// </editor-fold>
}
