package com.sp.team32ndproject.common.config;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sp.team32ndproject.common.checker.TeamInfoAuthManager;
import com.sp.team32ndproject.common.checker.TeamParamAuthManager;
import com.sp.team32ndproject.common.filter.CustomAuthenticationFilter;
import com.sp.team32ndproject.common.provider.CustomAuthenticationProvider;
import com.sp.team32ndproject.common.provider.JWTTokenProvider;
import com.sp.team32ndproject.team.mapper.TeamInfoMapper;
import com.sp.team32ndproject.team.service.TeamInfoService;
import com.sp.team32ndproject.user.service.UserInfoService;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class SecurityBeanConfig {
	@Autowired
	private UserInfoService userInfoService;
	@Autowired
	private TeamInfoService teamInfoService;
	@Autowired
	private TeamInfoMapper teamInfoMapper;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private ObjectMapper objectMapper;
	@Autowired
	private JWTTokenProvider jwtProvider;

	@Bean
	WebSecurityCustomizer webSecurityCustomizer() { // static 안에 있는 css등등 필요한 애들은 webServer딴에서 이그노어 해줘야 해서 일케 함
		return web -> {
			web.ignoring().antMatchers("/css/**", "/js/**", "/imgs/**", "/resources/**", "/react/**");
		};
	}

	@Bean
	UsernamePasswordAuthenticationFilter usernamePasswordAuthenticationFilter() {
		CustomAuthenticationFilter filter = new CustomAuthenticationFilter(authenticationManager(), jwtProvider,
				objectMapper);
		filter.setFilterProcessesUrl("/api/login");
		filter.afterPropertiesSet();
		return filter;
	}

	@Bean
	AuthenticationProvider authenticationProvider() {
		return new CustomAuthenticationProvider(userInfoService, passwordEncoder);
	}

	@Bean
	AuthenticationManager authenticationManager() {
		return new ProviderManager(authenticationProvider());
	}

	@Bean
	SecurityFilterChain securityTeamPageFilterChain(HttpSecurity hs) throws Exception {
		hs.authorizeHttpRequests((auth) -> auth
				.antMatchers("/auth/user-infos/*", "/login", "/join", "/page/user/login", "/page/user/join", "/",
						"/team-infos", "/match-board","/api/login")
				.permitAll()
				.antMatchers("/page/team/team-settings", "/page/team/team-apply", "/page/match/match-status",
						"/page/team/record")
				.access(new TeamParamAuthManager(teamInfoService)).antMatchers("/page/team/**")
				.access(new TeamInfoAuthManager(teamInfoMapper)).anyRequest().authenticated())
				.formLogin(formLogin -> formLogin.loginPage("/page/user/login").usernameParameter("uiId")
						.passwordParameter("uiPwd").loginProcessingUrl("/login").defaultSuccessUrl("/")
						.failureUrl("/page/user/login?errorMsg=Plz check ID or PWD"))
				.logout(logout -> logout.logoutUrl("/auth/logout").logoutSuccessUrl("/page/user/login"));
		hs.csrf(csrf -> csrf.disable()).exceptionHandling(handling -> handling.accessDeniedPage("/page/denied"))
				.userDetailsService(userInfoService)
		.cors(cors->cors.configurationSource(new CorsConfigurationSource(){
			@Override
			public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
				CorsConfiguration ccf =new CorsConfiguration();
				ccf.setAllowedOrigins(List.of("http://localhost:3000"));
				ccf.setAllowedMethods(List.of("POST", "PATCH", "PUT", "GET", "POST", "DELETE"));
				ccf.setAllowedHeaders(List.of("*"));
				ccf.setAllowCredentials(true);
				return ccf;				
			}
		}));
		return hs.build();
	}
}
