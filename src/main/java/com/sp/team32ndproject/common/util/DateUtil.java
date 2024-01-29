package com.sp.team32ndproject.common.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;

public class DateUtil {
	public static String getToDate(String...formats) {
		String format = "yyyy-MM-dd HH:mm:ss.SSS";
		if(formats != null && formats.length == 1) {
			format = formats[0];
		}
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
		Calendar calendar = Calendar.getInstance();
		return simpleDateFormat.format(calendar.getTime());
	}
	
}
