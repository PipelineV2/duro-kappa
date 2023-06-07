//import { expect } from 'chai';
import createForm, { FormSetup } from './index';
import * as Yup from 'yup';

const initialValues = { name: '', location: "" }
const validationSchema = Yup.object({
	name: Yup.string().required(),
	location: Yup.string().required()
});
let Form: FormSetup<typeof initialValues>


beforeEach(() => {
	Form = createForm<typeof initialValues, typeof validationSchema>({
		initialValues,
		validationSchema
	});
})

it('should render all the inputs and the buttons', () => {
	cy.mount(
		<Form submit={async (values: typeof initialValues) => { console.log(values) }}>
			<div>
				<Form.Input name="name" />
				<Form.Input name="location" />
				<Form.Submit text="submit" />
			</div>
		</Form>
	)

	cy.get('[name=name]');
	cy.get('[name=location]');
	cy.get('button[type=submit]');
});

it('should not submit if any required field is empty', () => {
	cy.mount(
		<Form submit={(values: typeof initialValues) => { console.log(values) }}>
			<div>
				<Form.Input name="name" />
				<Form.Input name="location" />
				<Form.Submit text="submit" />
			</div>
		</Form>
	)

	cy.get('[name=name]').type('myname');
	cy.get('button[type=submit]').click();
	cy.get('[data-input-error=location]').contains("location is a required field");
});

it('should submit if all fields have been filled', () => {
	let submitted = false;

	cy.mount(
		<Form submit={async (values: typeof initialValues) => { submitted = true }}>
			<div>
				<Form.Input name="name" />
				<Form.Input name="location" />
				<Form.Submit text="submit" />
			</div>
		</Form>
	)

	//expect(submitted).to.be.false;
	cy.get('[name=name]').type('myname');
	cy.get('[name=location]').type('myname');
	cy.get('button[type=submit]').click();
	cy.get('[data-input-error=location]').should('be.empty')
	cy.get('[data-input-error=name]').should('be.empty')
	cy.get('button[type=submit]').contains("loading")
	//expect(submitted).to.be.true;
});

