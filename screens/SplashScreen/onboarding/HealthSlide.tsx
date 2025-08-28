import Description from "./Description";
import Layout from "./Layout";
import MicroText from "./MicroText";
import Title from "./Title";

export default function HealthSlide() {
  return (
    <Layout>
      <Title text="Tu mascota, tu familia. Su salud, siempre contigo." />
      <Description text="Adiós al caos de papeles. Vacunas, desparasitaciones y todo lo importante, siempre a la mano." />
      <MicroText text="Guarda su cartilla una vez. Encuéntrala siempre." />
    </Layout>
  );
}
