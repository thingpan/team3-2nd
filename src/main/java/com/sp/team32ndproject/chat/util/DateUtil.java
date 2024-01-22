package com.sp.team32ndproject.chat.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;

public class DateUtil {
								//옵션 파라미터(넣어도 그만 안넣어도 그만)
	public static String getToDate(String...formats) {
		String format = "yyy-MM-dd hh:mm:ss.SSS";
		if(formats == null || formats.length == 1) {
			format = formats[0];
		}
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		Calendar cal = Calendar.getInstance();
		return sdf.format(cal.getTime());
	}

}
