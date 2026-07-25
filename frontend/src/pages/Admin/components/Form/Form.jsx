import styles from './Form.module.css';
import Icons from '../../../../assets/icons'
import {Link} from 'react-router-dom'
import {Button} from '../../../../shared/components/Button/Button'

export default function Form({children}) {
  return (
    <div className={styles.container}>
      <p className={styles.title}>Edit</p>
      <div className={styles.containerInput}>
        {children}
      </div>
    </div>
  );
}

export function FormInput({title, placeholder}){
  return (
    <div className={styles.inputContainer}>
      <p>{title}</p>
      <input className={styles.input} placeholder={placeholder}/>
    </div>
  )
}
export function FormSelect({title, values}){
  return (
  <div className={styles.inputContainer}>
      <p>{title}</p>
      <div className={styles.select}>
        <p>value</p>
        <Icons.chevronDown/>
      </div>
    </div>
  )
}

export function FormAction({title}){
return (
  <div className={styles.inputContainer}>
      <p>{title}</p>
      <div className={styles.actionContainer}>
        <Button className={`${styles.formAction} ${styles.approve}`}><Icons.circleCheck/> Approve</Button>
        <Button className={`${styles.formAction} ${styles.reject}`}><Icons.circleWrong/> Reject</Button>
      </div>
    </div>
  )
}
