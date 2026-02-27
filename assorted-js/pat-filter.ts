interface Patient {
  id: number;
  name: string;
  address: string;
  dateOfBirth: Date;
}

interface Query {
  id?: number;
  name?: string;
  address?: string;
  minDateOfBirth?: Date;
}


type FilterPredicate<K extends keyof Query> = (patient: Patient, value: NonNullable<Query[K]>) => boolean;

const filterRegistry: { [K in keyof Query]?: FilterPredicate<K> } = {
  id: (patient, value) => patient.id === value,
  name: (patient, value) => patient.name === value,
  address: (patient, value) => patient.address === value,
  minDateOfBirth: (patient, value) => patient.dateOfBirth >= value,
};

// when this is empty, all test cases are run
const TEST_CASES_TO_RUN: number[] = [];

class PatientDatabase {
  private patients: Patient[] = [];

  public insert(patient: Patient): void {
    this.patients.push(patient);
  }

  public query(params: Query): Patient[] {
    const keys = Object.keys(params) as (keyof Query)[];
    const activeFilters = keys.filter(k => params[k] != null && filterRegistry[k] != null);

    if (activeFilters.length === 0) {
      return this.patients;
    }

    return this.patients.filter(patient =>
      activeFilters.every(key => {
        const predicate = filterRegistry[key]!;
        return (predicate as FilterPredicate<typeof key>)(patient, params[key]!);
      })
    );
  }
}

/**************
 * Test cases *
 **************/

const database = new PatientDatabase();

database.insert({
  id: 0,
  name: "Sarah",
  address: "123 Maple Street, Portland, OR 97201",
  dateOfBirth: new Date("1985-03-15"),
});

database.insert({
  id: 1,
  name: "Michael",
  address: "456 Oak Avenue, Seattle, WA 98101",
  dateOfBirth: new Date("1992-08-22"),
});

database.insert({
  id: 2,
  name: "Maria",
  address: "789 Pine Road, San Francisco, CA 94102",
  dateOfBirth: new Date("1978-12-03"),
});

database.insert({
  id: 3,
  name: "James",
  address: "321 Elm Boulevard, Austin, TX 78701",
  dateOfBirth: new Date("1990-05-30"),
});

database.insert({
  id: 4,
  name: "Aisha",
  address: "654 Cedar Lane, Chicago, IL 60601",
  dateOfBirth: new Date("1988-10-18"),
});

database.insert({
  id: 5,
  name: "Robert",
  address: "987 Birch Court, Boston, MA 02101",
  dateOfBirth: new Date("1965-02-07"),
});

database.insert({
  id: 6,
  name: "Jennifer",
  address: "147 Spruce Drive, Miami, FL 33101",
  dateOfBirth: new Date("1995-07-12"),
});

database.insert({
  id: 7,
  name: "David",
  address: "258 Willow Street, Denver, CO 80201",
  dateOfBirth: new Date("1982-04-25"),
});

database.insert({
  id: 8,
  name: "Sarah",
  address: "369 Ash Avenue, Phoenix, AZ 85001",
  dateOfBirth: new Date("1998-11-08"),
});

database.insert({
  id: 9,
  name: "Robert",
  address: "741 Walnut Road, Atlanta, GA 30301",
  dateOfBirth: new Date("1973-06-14"),
});

let testCaseIndex = 0;

testCase("Test Case 1", database.query({}), {
  expectedPatientIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
});

testCase("Test Case 2", database.query({ name: "Jennifer" }), {
  expectedPatientIds: [6],
});

testCase("Test Case 3", database.query({ name: "Sarah" }), {
  expectedPatientIds: [0, 8],
});

testCase("Test Case 4", database.query({ name: "Zach" }), {
  expectedPatientIds: [],
});

testCase("Test Case 5", database.query({ id: 2 }), {
  expectedPatientIds: [2],
});

testCase("Test Case 6", database.query({ id: 20 }), {
  expectedPatientIds: [],
});

testCase("Test Case 7", database.query({ id: 5, name: "David" }), {
  expectedPatientIds: [],
});

testCase("Test Case 8", database.query({ id: 5, name: "Robert" }), {
  expectedPatientIds: [5],
});

testCase("Test Case 9", database.query({
  minDateOfBirth: new Date('1986-03-07')
}), {
  expectedPatientIds: [1, 3, 4, 6, 8],
});

testCase("Test Case 10", database.query({
  minDateOfBirth: new Date('1950-01-01')
}), {
  expectedPatientIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
});

testCase("Test Case 11", database.query({
  minDateOfBirth: new Date('1998-11-08')
}), {
  expectedPatientIds: [8],
});

testCase("Test Case 12", database.query({
  minDateOfBirth: new Date('1998-11-9')
}), {
  expectedPatientIds: [],
});

testCase("Test Case 13", database.query({
  minDateOfBirth: new Date('1970-01-01'),
  name: "Robert",
}), {
  expectedPatientIds: [9],
});

function testCase(
  test: string,
  result: Patient[],
  {
    checkOrder = false,
    expectedPatientIds,
  }: { expectedPatientIds: number[]; checkOrder?: boolean },
) {
  testCaseIndex++;
  if (TEST_CASES_TO_RUN.length > 0 && !TEST_CASES_TO_RUN.includes(testCaseIndex)) {
    return;
  }
  
  
  const fail = () => {
    console.error(`[${test}]: Failed`);
    console.error(`  Expected: ${expectedPatientIds.join(", ")}`);
    console.error(
      `  Received: ${result.length > 0 ? result.map((patient) => patient.id).join(", ") : "[]"}`,
    );
  };

  if (result.length !== expectedPatientIds.length) {
    fail();
    return;
  }

  const expectedIds = [...expectedPatientIds];
  const actualIds = result.map((patient) => patient.id);

  if (!checkOrder) {
    expectedIds.sort();
    actualIds.sort();
  }

  for (let i = 0; i < expectedIds.length; i++) {
    if (expectedIds[i] !== actualIds[i]) {
      fail();
      return;
    }
  }

  console.log(`[${test}] Test passed`);
}
