import {Component, OnInit} from '@angular/core';
import {RoadmapItem} from '../../roadmapitem.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute} from '@angular/router';
import {RoadmapDataService} from '../../roadmap-data.service';
import {Question} from '../Question.model';
import {Survey} from '../survey.model';
import {QuestionDataService} from '../question-data.service';
import {SurveyDataService} from '../survey-data.service';

interface QuestionFieldJson {
  type: string;
  questionString: string;
  answers: AnswerFieldJson[];
}

interface AnswerFieldJson {
  answer: string;
}

@Component({
  selector: 'app-update-survey',
  templateUrl: './update-survey.component.html',
  styleUrls: ['./update-survey.component.css']
})
export class UpdateSurveyComponent implements OnInit {

  public roadmapItem: RoadmapItem;
  public survey: Survey;
  public surveyFrom: FormGroup;
  public questionTypes = ['Yes/No', 'Multiple choice', 'Range', 'Open'];
  faPlus = faPlus;
  faMin = faMinus;

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private roadmapDataService: RoadmapDataService,
              private surveyDataService: SurveyDataService,
              private questionDataService: QuestionDataService
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(item => this.roadmapItem = item.roadmapItem);

    this.survey = this.roadmapItem.survey;

    // create form
    this.surveyFrom = this.fb.group({
      questions: this.fb.array([this.createQuestion()])
    });
    // populate form
    this.surveyFrom.setControl('questions', this.populateQuestions(this.survey.Questions));
  }

  private populateQuestions(questions: Question[]): FormArray {
    const qFormArray = new FormArray([]);
    questions.forEach(q => {
      let stringType: string;
      switch (q.Type) {
        case 0: {
          stringType = 'Yes/No';
          break;
        }
        case 1: {
          stringType = 'Range';
          break;
        }
        case 2: {
          stringType = 'Multiple choice';
          break;
        }
        default: {
          stringType = 'Open';
          break;
        }
      }
      const qform = this.fb.group({
        type: [stringType, Validators.required],
        questionString: [q.QuestionString, Validators.required],
        answers: this.fb.array([this.createAnswer()])
      });
      // populate answers
      qform.setControl('answers', this.populateAnswers(q.PossibleAnswers));
      qFormArray.push(qform);
    });
    return qFormArray;
  }

  private populateAnswers(answsers: Map<string, number>): FormArray {
    const aFormArray = new FormArray([]);
    answsers.forEach((v, k) => {
      aFormArray.push(this.fb.group({
        answer: [k]
      }));
    });
    return aFormArray;
  }

  createQuestion(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      questionString: ['', Validators.required],
      answers: this.fb.array([this.createAnswer()])
    });
  }

  createAnswer(): FormGroup {
    return this.fb.group({
      answer: ['']
    });
  }

  onSubmit(): void {
    // survey aanmaken voor dit RMI
    let newSurveyObj: Survey;
    this.roadmapDataService
      .addSurveyToRoadmapItem(this.roadmapItem.id)
      .subscribe((response) => newSurveyObj = response);

    if (newSurveyObj) {
      const questionFields: FormArray = this.surveyFrom.controls.questions.value as FormArray;
      // console.log(questionFields);
      for (let i = 0; i <= questionFields.length; i++) {
        const question = questionFields[i] as QuestionFieldJson;
        if (question === undefined) {
          continue;
        }
        // question aanmaken
        const newQuestionJson = {
          type: 0,
          questionString: ''
        };
        newQuestionJson.questionString = question.questionString;

        switch (question.type) {
          case 'Yes/No': {
            newQuestionJson.type = 0;
            break;
          }
          case 'Range': {
            newQuestionJson.type = 1;
            break;
          }
          case 'Multiple choice': {
            newQuestionJson.type = 2;
            break;
          }
          default: {
            newQuestionJson.type = 3;
            break;
          }
        }
        // console.log(newQuestionJson);
        let newQuestionObj: Question;
        // question persisteren
        this.surveyDataService.addQuestionToSurvey(newSurveyObj.Id, newQuestionJson).subscribe((response) => newQuestionObj = response);
        // eventueel answers toevoegen
        if (newQuestionObj && newQuestionObj.Type === 2) {
          const answers: string[] = [];
          question.answers.forEach(a => {
            answers.push(a.answer);
          });
          this.questionDataService.addAnswersToQuestion(newQuestionObj.Id, answers);
        }
      }

      // console.log(questionObjecten);
    }
  }

  getErrorMessage(errors: any): any {
    if (errors.required) {
      return 'is required';
    }
  }

  getQuestions(form): any {
    return form.controls.questions.controls;
  }

  getAnswers(question): any {
    return question.controls.answers.controls;
  }

  addQuestion(form): void {
    form.controls.questions.push(this.createQuestion());
  }

  addAnswer(question): void {
    question.controls.answers.push(this.createAnswer());
  }

  removeQuestion(form, i): void {
    form.controls.questions.removeAt(i);
  }

  removeAnswer(question, i): void {
    question.controls.answers.removeAt(i);
  }
}
