export async function getCountryCodes() {
    const response = await fetch("src/api/countryCodes.json");
    return await response.json();
}