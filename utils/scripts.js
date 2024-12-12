export default calculateOverweightPercentage = (
  petWeight,
  recommendedWeight
) => {
  const difference = petWeight - recommendedWeight;
  const percentage = (difference / recommendedWeight) * 100;
  return percentage;
};

export const calculatePetAge = (birthday) => {
  const birthDate = new Date(birthday);
  const today = new Date();

  console.log("birthDate: ", birthDate)
  console.log("today: ", today)

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  console.log("age: ", age)

  return age;
};

export const calculateIdealWeight = (rangeOne, rangeTwo, realWeight) => {
  if (realWeight >= rangeOne && realWeight <= rangeTwo) {
    return { ideal: true, up: false, down: false };
  } else if (realWeight > rangeTwo) {
    return { ideal: false, up: true, down: false };
  } else if (realWeight < rangeOne) {
    return { ideal: false, up: false, down: true };
  }
};

export const formatDateToDDMMYYYY = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
