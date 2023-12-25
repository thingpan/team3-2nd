package com.sp.team32ndproject.user.vo;

import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserInfoVO implements UserDetails {
	private int uiNum;
	private String uiName;
	private String uiBirth;
	private String uiAddress;
	private String uiPhoneNum;
	private String uiPwd;
	private String uiId;
	private String uiEmail;
	private String uiGender;
	private String uiArea;
	private String uiCredat;
	private String uiCretim;

	private Collection<? extends GrantedAuthority> authorities;
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}
	@Override
	public String getPassword() {
		return uiPwd;
	}
	@Override
	public String getUsername() {
		return uiId;
	}
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	@Override
	public boolean isEnabled() {
		return true;
	}

	
	
	
}
