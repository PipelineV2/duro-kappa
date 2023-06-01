import createForm from "@/components/form";
import * as Yup from 'yup';
import { QueueUserInputType } from '@/models/auth';

const validationSchema = Yup.object({
  email: Yup.string().required(),
  phone: Yup.string().required(),
})

export default function Home() {
  const Form = createForm<QueueUserInputType, typeof validationSchema>({
    initialValues: {
      email: "",
      phone: "",
    },
    validationSchema
  });

  const queue = () => {
    // api request to join queue.
    // returns the queue number, and 
  }
  return (
    <div>
      this is Reginals's store

      <div>
        queue up!. with your email or phone!
        a notification will be sent to you when it's almost your turn, and when its your turn.
      </div>

      <Form submit={queue}>
        <Form.Input placeholder="email" name="email" type="email" />
        <Form.Input placeholder="phone" name="phone" type="tel" />
        <Form.Submit text="submit form!" />
      </Form>
    </div>
  )
}
