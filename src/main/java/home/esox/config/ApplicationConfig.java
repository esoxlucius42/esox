package home.esox.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Application configuration class for Spring beans and general application setup.
 */
@Configuration
public class ApplicationConfig implements WebMvcConfigurer {

    /**
     * Configure view controllers to forward non-API routes to index.html for React SPA routing.
     * This allows React Router to handle client-side routing for paths like /notes.
     */
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
        registry.addViewController("/notes").setViewName("forward:/index.html");
        registry.addViewController("/apps").setViewName("forward:/index.html");
    }

}
