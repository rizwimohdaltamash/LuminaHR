export const initialData = [
    { id: 1, employee_name: "Tiger Nixon", employee_salary: 320800, employee_age: 61, profile_image: "" },
    { id: 2, employee_name: "Garrett Winters", employee_salary: 170750, employee_age: 63, profile_image: "" },
    { id: 3, employee_name: "Ashton Cox", employee_salary: 86000, employee_age: 66, profile_image: "" },
    { id: 4, employee_name: "Cedric Kelly", employee_salary: 433060, employee_age: 22, profile_image: "" },
    { id: 5, employee_name: "Airi Satou", employee_salary: 162700, employee_age: 33, profile_image: "" },
    { id: 6, employee_name: "Brielle Williamson", employee_salary: 372000, employee_age: 61, profile_image: "" },
    { id: 7, employee_name: "Herrod Chandler", employee_salary: 137500, employee_age: 59, profile_image: "" },
    { id: 8, employee_name: "Rhona Davidson", employee_salary: 327900, employee_age: 55, profile_image: "" },
    { id: 9, employee_name: "Colleen Hurst", employee_salary: 205500, employee_age: 39, profile_image: "" },
    { id: 10, employee_name: "Sonya Frost", employee_salary: 103600, employee_age: 23, profile_image: "" }
];

export const fetchDummyEmployees = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const stored = localStorage.getItem("employees");
    let data;
    if (stored) {
        data = JSON.parse(stored);
    } else {
        localStorage.setItem("employees", JSON.stringify(initialData));
        data = initialData;
    }

    return { status: "success", data };
};
