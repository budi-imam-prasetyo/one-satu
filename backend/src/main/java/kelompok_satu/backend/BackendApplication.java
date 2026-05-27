package kelompok_satu.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.directory("backend") //sesuaikan dengan path .env
				.ignoreIfMalformed()
				.ignoreIfMissing()
				.load();

		dotenv.entries().forEach(e->{
			if(e.getValue() != null){
				System.out.println(e.getKey() + e.getValue());
				System.setProperty(e.getKey(), e.getValue());

			}
		});

//		String db = dotenv.get("POSTGRES_DB");
//		String user = dotenv.get("POSTGRES_USER");
//		String pass = dotenv.get("POSTGRES_PASSWORD");

//		System.out.println("WORKDIR: " + System.getProperty("user.dir"));
//		System.out.println("DB: " + db);
//		System.out.println("USER: " + user);
//		System.out.println("PASS: " + pass);

//		if (db != null) System.setProperty("POSTGRES_DB", db);
//		if (user != null) System.setProperty("POSTGRES_USER", user);
//		if (pass != null) System.setProperty("POSTGRES_PASSWORD", pass);

		SpringApplication.run(BackendApplication.class, args);
	}

}
