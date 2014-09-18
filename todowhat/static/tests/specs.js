var Todo = require('../js/models/todo');

describe("the todo", function(){

  beforeEach(function(){
    this.todo = new Todo({
      content: "A test todo"
    });
  });

  it("should have content", function(){
    expect(this.todo.get("content")).toBe("A test todo");
  });
  it("should not be done yet", function(){
    expect(this.todo.get("done")).toBe(false);
  });
  it("should have no tags yet", function(){
    expect(this.todo.getTags()).not.toBeTruthy();
  });
});
describe("todo blank content", function(){
  beforeEach(function(){
    this.todo = new Todo({content: ''});
  });
  it("should not create the todo", function(){
    expect(this.todo.isValid()).not.toBeTruthy();
  })
});
describe("todo content length greater than 255 chars", function(){
  beforeEach(function(){
    this.todo = new Todo({content: 'dafskljSadsfasdfafdsakfj;aslkfjsakldjfkaldsjfakdafskljakfj;aslkfjsakldjfkaldsjfakdafskljakfj;aslkfjsakldjfkaldsjfakdafskljakfj;aslkfjsakldjfkaldsjfakdafskljakfj;aslkfjsakldjfkaldsjfakdafskljakfj;aslkfjsakldjfkaldsjfakdafskljakfj;aslkfjsakldjfkaldsjfakdafskljakfj;aslsds'});
  });
  it("should not create the todo", function(){
    expect(this.todo.isValid()).not.toBeTruthy();
  })
});