const Header = (props) => <h1>{props.header}</h1>

const CourseHeader = (props) => <h2>{props.name}</h2>

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const CourseContent = (props) => (
  <div>
    {props.parts.map(part => <Part key={part.id} part={part} />)}
  </div>
)

const Total = (props) => {
  const total = props.parts.reduce(
    (accumulator, currentvalue) => accumulator + currentvalue.exercises, 0,
  )
  return (
  <p><strong>Total of {total} exercises</strong></p>
  )
}

const CourseInfo = ({course}) => {
  return(
    <div>
      <CourseHeader name={course.name} />
      <CourseContent parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Content = ({courses}) => {
  return(
    <div>
      {courses.map(course => <CourseInfo key={course.id} course={course} />)}
  </div>
  )
}

const Courses = ({courses}) => {
  return(
    <div>
      <Header header="Web development curriculum" />
      <Content courses={courses} />
    </div>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <Courses courses={courses} />
    </div>
  )
}

export default App
