package com.databaseModeling.Server.model;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ValidationResult {

    private List<String> errors = new ArrayList<>();

    private List<String> warnings = new ArrayList<>();

    public boolean containsWarnings(){
        return warnings.isEmpty();
    }

    public boolean containsErrors(){
        return errors.isEmpty();
    }

    public void addError(String errorMessage){
        this.errors.add(errorMessage);
    }

    public void addErrors(List<String> errorMessages){
        this.errors.addAll(errorMessages);
    }

    public void addErrorWithPrefix(String prefix,String errorMessage){
        this.errors.add(withPrefix(prefix, errorMessage));
    }

    public void addErrorsWithPrefix(String prefix, List<String> errorMessages){
        this.errors.addAll(withPrefix(prefix, errorMessages));
    }

    public void addWarning(String warningMessage){
        this.warnings.add(warningMessage);
    }

    public void addAllWarnings(List<String> warningMessages){
        this.warnings.addAll(warningMessages);
    }

    public void addWarningWithPrefix(String prefix, String warningMessage){
        this.warnings.add(withPrefix(prefix, warningMessage));
    }

    public void addAllWarningsWithPrefix(String prefix, List<String> warningMessages){
        this.warnings.addAll(withPrefix(prefix, warningMessages));
    }

    private List<String> withPrefix(String prefix, List<String> messages){
        return messages.stream().map(message -> withPrefix(prefix, message)).collect(Collectors.toList());
    }

    private String withPrefix(String prefix, String message){
        return MessageFormat.format("{0} : {1}", prefix, message);
    }

}
